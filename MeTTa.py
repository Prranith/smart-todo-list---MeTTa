import firebase_admin
from firebase_admin import credentials, firestore
from datetime import datetime, timedelta
import logging
import time
from hyperon import MeTTa
import re
from zoneinfo import ZoneInfo

# Configure logging
logging.basicConfig(level=logging.INFO, format="%(asctime)s - %(levelname)s - %(message)s")
logger = logging.getLogger(_name_)

class TaskScheduler:
    def _init_(self, service_account_path):
        """Initialize Firebase and MeTTa."""
        try:
            cred = credentials.Certificate(service_account_path)
            if not firebase_admin._apps:
                firebase_admin.initialize_app(cred)
            self.db = firestore.client()
            logger.info("Firebase initialized successfully")
        except Exception as e:
            logger.error(f"Failed to initialize Firebase: {e}")
            raise

        # Initialize MeTTa
        self.metta = MeTTa()
        self.metta.run('!(bind! &tasks (new-space))')
        self.metta.run('!(bind! &schedule (new-space))')
        with open("scheduler.metta", "r") as f:
            self.metta.run(f.read())
        logger.info("MeTTa initialized with scheduler logic")

        # IST timezone
        self.ist = ZoneInfo("Asia/Kolkata")

    def get_tasks_for_user(self, user_id):
        """Fetch and validate tasks from Firebase."""
        try:
            tasks_ref = self.db.collection("users").document(user_id).collection("tasks")
            docs = tasks_ref.stream()
            tasks = {}
            for doc in docs:
                data = doc.to_dict()
                task_id = doc.id

                # Validate and convert fields
                try:
                    # Duration: Convert to int, default 30
                    duration = data.get("duration", 30)
                    if isinstance(duration, str):
                        duration = int(float(duration.strip()))
                    if not isinstance(duration, int) or duration <= 0:
                        logger.warning(f"Invalid duration for task ID {task_id}: {duration}")
                        continue

                    # Timestamps: Convert to IST
                    start_time = data.get("startTime", "")
                    created_at = data.get("createdAt", start_time)
                    try:
                        start_dt = datetime.fromisoformat(start_time.replace("Z", "+00:00")).astimezone(self.ist)
                        created_dt = datetime.fromisoformat(created_at.replace("Z", "+00:00")).astimezone(self.ist)
                        start_time = start_dt.isoformat()
                        created_at = created_dt.isoformat()
                    except (ValueError, TypeError):
                        logger.warning(f"Invalid timestamp for task ID {task_id}: start={start_time}, created={created_at}")
                        continue

                    # Priority: Ensure valid
                    priority = data.get("priority", "Low")
                    if priority not in ["High", "Medium", "Low"]:
                        priority = "Low"

                    tasks[task_id] = {
                        "id": task_id,
                        "title": data.get("title", ""),
                        "description": data.get("description", ""),
                        "startTime": start_time,
                        "endTime": data.get("endTime", ""),
                        "duration": duration,
                        "priority": priority,
                        "category": data.get("category", ""),
                        "completed": bool(data.get("completed", False)),
                        "createdAt": created_at
                    }
                except (ValueError, TypeError) as e:
                    logger.warning(f"Skipping task ID {task_id} due to error: {e}")
                    continue

            logger.info(f"Fetched {len(tasks)} unique tasks for user {user_id}")
            return list(tasks.values())
        except Exception as e:
            logger.error(f"Error fetching tasks for user {user_id}: {e}")
            return []

    def setup_realtime_listener(self, user_id, callback):
        """Set up real-time listener."""
        try:
            tasks_ref = self.db.collection("users").document(user_id).collection("tasks")
            tasks_ref.on_snapshot(lambda docs, changes, read_time: callback(self.get_tasks_for_user(user_id)))
            logger.info(f"Real-time listener set up for user {user_id}")
        except Exception as e:
            logger.error(f"Failed to set up real-time listener: {e}")

    def update_atomspace(self, tasks):
        """Add, update, or remove tasks in MeTTa atomspace."""
        try:
            self.metta.run('!(clear-space &schedule)')
            for task in tasks:
                task_id = task["id"]
                if task["duration"] <= 0:
                    logger.warning(f"Skipping task '{task.get('title', '')}' with invalid duration")
                    continue
                if not task.get("startTime") or not task.get("priority"):
                    logger.warning(f"Skipping task '{task.get('title', '')}' with missing startTime/priority")
                    continue

                title = re.sub(r'["\\]', '', task["title"])
                start_time = task["startTime"]
                priority = task["priority"]
                duration = str(task["duration"])
                completed = "true" if task["completed"] else "false"
                created_at = task["createdAt"]

                # Update-atom
                self.metta.run(f'!(remove-atom &tasks (task "{task_id}" $title $startTime $priority $duration $completed $createdAt))')
                if completed == "true":
                    logger.debug(f"Removed completed task: {title} (ID: {task_id})")
                    continue

                atom = f'(task "{task_id}" "{title}" "{start_time}" "{priority}" {duration} {completed} "{created_at}")'
                self.metta.run(f'!(add-atom &tasks {atom})')
                logger.debug(f"Added/updated atom: {title} (ID: {task_id})")

            logger.info(f"Updated atomspace with {len(tasks)} tasks")
        except Exception as e:
            logger.error(f"Error updating atomspace: {e}")

    def schedule_tasks(self, current_time=None):
        """Run MeTTa scheduler in IST."""
        try:
            if current_time is None:
                current_time = datetime.now(self.ist)
            current_time_str = current_time.isoformat()
            end_time = current_time.replace(hour=23, minute=59, second=59)
            available_minutes = (end_time - current_time).total_seconds() / 60

            self.metta.run(f'!(schedule-tasks "{current_time_str}" {available_minutes})')
            results = self.metta.run('!(match &schedule (scheduled-task $id $title $start $end $priority) ($id $title $start $end $priority))')

            scheduled_tasks = []
            for result in results:
                try:
                    if len(result) != 5:
                        logger.warning(f"Skipping malformed schedule: {result}")
                        continue
                    task_id, title, start, end, priority = [str(r) for r in result]
                    # Validate timestamps
                    try:
                        datetime.fromisoformat(start)
                        datetime.fromisoformat(end)
                    except ValueError:
                        logger.warning(f"Invalid schedule times for {title}: start={start}, end={end}")
                        continue
                    scheduled_tasks.append({
                        "id": task_id,
                        "title": title,
                        "scheduled_start": start,
                        "scheduled_end": end,
                        "priority": priority
                    })
                    self._mark_task_completed(task_id, title)
                except Exception as e:
                    logger.error(f"Error processing schedule {result}: {e}")

            logger.info(f"Scheduled {len(scheduled_tasks)} tasks")
            return scheduled_tasks
        except Exception as e:
            logger.error(f"Error in schedule_tasks: {e}")
            return []

    def _mark_task_completed(self, task_id, title):
        """Mark task as completed."""
        try:
            task_ref = self.db.collection("users").document("msizKtIEfoWGoySQNndO5yF1xa53").collection("tasks").document(task_id)
            task_ref.update({"completed": True})
            self.metta.run(f'!(remove-atom &tasks (task "{task_id}" $title $startTime $priority $duration $completed $createdAt))')
            logger.debug(f"Completed task: {title} (ID: {task_id})")
        except Exception as e:
            logger.error(f"Error marking task '{title}' as completed: {e}")

def main():
    try:
        scheduler = TaskScheduler("serviceAccountKey.json")
        user_id = "msizKtIEfoWGoySQNndO5yF1xa53"

        def process_tasks(tasks):
            if not tasks:
                logger.warning("No tasks found")
                return

            logger.info(f"Processing {len(tasks)} tasks")
            scheduler.update_atomspace(tasks)
            scheduled_tasks = scheduler.schedule_tasks()

            print("\n✅ Prioritized Tasks:")
            tasks_result = scheduler.metta.run('!(match &tasks (task $id $title $startTime $priority $duration $completed $createdAt) ($id $title $startTime $priority))')
            for i, task in enumerate(tasks_result, 1):
                if len(task) == 4:
                    print(f"{i}. {task[1]} - Priority: {task[3]} - Start: {task[2]}")

            print("\n📅 Schedule:")
            for i, task in enumerate(scheduled_tasks, 1):
                start = datetime.fromisoformat(task['scheduled_start']).strftime("%H:%M")
                end = datetime.fromisoformat(task['scheduled_end']).strftime("%H:%M")
                print(f"{i}. {start}-{end}: {task['title']} (Priority: {task['priority']})")

        # Test tasks
        tasks = [
            {
                "id": "TP2q1lDUC8R4KBuSnVJH",
                "title": "Breakfast",
                "startTime": "2025-04-12T09:01:33.921+05:30",
                "duration": 30,
                "priority": "Medium",
                "completed": False,
                "createdAt": "2025-04-12T09:01:33.921+05:30"
            },
            {
                "id": "3SYz1acxBwXn1cO79wDe",
                "title": "Washroom",
                "startTime": "2025-04-12T08:03:10.317+05:30",
                "duration": 15,
                "priority": "High",
                "completed": False,
                "createdAt": "2025-04-12T08:03:10.317+05:30"
            }
        ]
        process_tasks(tasks)
        scheduler.setup_realtime_listener(user_id, process_tasks)
        while True:
            time.sleep(1)

    except KeyboardInterrupt:
        logger.info("Shutting down")
    except Exception as e:
        logger.error(f"Error in main: {e}")

if _name_ == "_main_":
    main()