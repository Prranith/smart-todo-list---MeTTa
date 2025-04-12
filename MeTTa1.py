from datetime import datetime, timedelta
from typing import List, Tuple

# Task & ScheduledTask classes
class Task:
    def _init_(self, task_id, title, start_time, priority, duration, completed, created_at):
        self.task_id = task_id
        self.title = title
        self.start_time = start_time
        self.priority = priority
        self.duration = duration
        self.completed = completed
        self.created_at = created_at

class ScheduledTask:
    def _init_(self, task_id, title, start_time, end_time, priority):
        self.task_id = task_id
        self.title = title
        self.start_time = start_time
        self.end_time = end_time
        self.priority = priority

# Time handling helpers
def parse_timestamp(ts: str) -> datetime:
    return datetime.strptime(ts, "%Y-%m-%d %H:%M")

def format_time(dt: datetime) -> str:
    return dt.strftime("%Y-%m-%d %H:%M")

def max_time(t1: str, t2: str) -> str:
    return format_time(max(parse_timestamp(t1), parse_timestamp(t2)))

def add_minutes(start_time: str, minutes: int) -> str:
    return format_time(parse_timestamp(start_time) + timedelta(minutes=minutes))

def time_diff_minutes(t1: str, t2: str) -> int:
    return int((parse_timestamp(t1) - parse_timestamp(t2)).total_seconds() / 60)

# Priority and scoring logic
def priority_score(priority: str) -> int:
    return {"High": 3, "Medium": 2, "Low": 1}.get(priority, 1)

def time_score(start_time: str) -> int:
    deadline = datetime(2100, 1, 1)
    return int((deadline - parse_timestamp(start_time)).total_seconds())

def composite_score(priority: str, start_time: str) -> int:
    if priority == "High":
        return 3000000
    return priority_score(priority) * 1000000 + time_score(start_time)

# Sort tasks
def sort_tasks(tasks: List[Task]) -> List[Tuple[int, str, Task]]:
    scored = [(composite_score(t.priority, t.start_time), t.created_at, t) for t in tasks]
    return [tup[2] for tup in sorted(scored, key=lambda x: (-x[0], x[1]))]

# Scheduler core
def schedule_tasks(tasks: List[Task], current_time: str, available_minutes: int) -> List[ScheduledTask]:
    tasks = [t for t in tasks if not t.completed]
    high_priority = [t for t in tasks if t.priority == "High"]
    others = [t for t in tasks if t.priority != "High"]
    sorted_others = sort_tasks(others)
    return schedule_core(high_priority, sorted_others, current_time, available_minutes)

def schedule_core(high_priority, others, current_time, available_minutes) -> List[ScheduledTask]:
    scheduled = []

    for hp in high_priority:
        hp_start = max_time(current_time, hp.start_time)
        hp_end = add_minutes(hp_start, hp.duration)
        if hp.duration <= available_minutes:
            before_tasks = schedule_before(others, current_time, hp_start, available_minutes)
            scheduled.extend(before_tasks)
            scheduled.append(ScheduledTask(hp.task_id, hp.title, hp_start, hp_end, hp.priority))
            current_time = hp_end
            available_minutes -= hp.duration
            others = remove_scheduled(others, before_tasks)
        else:
            continue

    scheduled.extend(schedule_before(others, current_time, current_time, available_minutes))
    return scheduled

def schedule_before(tasks, current_time, hp_start, available_minutes) -> List[ScheduledTask]:
    scheduled = []
    for t in tasks:
        available = time_diff_minutes(hp_start, current_time)
        if t.duration <= available and t.duration <= available_minutes:
            start = max_time(current_time, t.start_time)
            end = add_minutes(start, t.duration)
            scheduled.append(ScheduledTask(t.task_id, t.title, start, end, t.priority))
            current_time = end
            available_minutes -= t.duration
        else:
            continue
    return scheduled

def remove_scheduled(tasks: List[Task], scheduled_tasks: List[ScheduledTask]) -> List[Task]:
    scheduled_ids = {st.task_id for st in scheduled_tasks}
    return [t for t in tasks if t.task_id not in scheduled_ids]

# MAIN FUNCTION
def main():
    tasks = [
        Task("1", "Fix Bug", "2025-04-12 16:00", "High", 30, False, "2025-04-10 12:00"),
        Task("2", "Write Report", "2025-04-12 15:30", "Medium", 20, False, "2025-04-11 10:00"),
        Task("3", "Check Email", "2025-04-12 15:00", "Low", 10, False, "2025-04-12 08:00"),
        Task("4", "Debug Logs", "2025-04-12 15:15", "Low", 10, False, "2025-04-11 09:00"),
        Task("5", "Daily Standup", "2025-04-12 15:05", "High", 15, False, "2025-04-12 07:00"),
    ]

    current_time = "2025-04-12 15:00"
    available_minutes = 60

    schedule = schedule_tasks(tasks, current_time, available_minutes)

    print("\nScheduled Tasks:")
    for task in schedule:
        print(f"{task.title} | {task.start_time} - {task.end_time} | Priority: {task.priority}")

if _name_ == "_main_":
    main()