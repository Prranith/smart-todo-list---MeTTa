from datetime import datetime
from typing import Optional, Dict

def to_firestore_timestamp(dt: Optional[datetime]) -> Optional[Dict]:
    """Convert datetime to Firestore Timestamp-like structure."""
    if dt:
        seconds = int(dt.timestamp())
        nanoseconds = (dt.microsecond * 1000) % 1000000000
        return {"seconds": seconds, "nanoseconds": nanoseconds}
    return None

def validate_task_data(task_data: Dict) -> Dict:
    """Validate task data for consistency."""
    errors = []
    
    if not task_data.get("title") or task_data["title"] == "Untitled Task":
        errors.append("Title is required or cannot be default 'Untitled Task'")
    
    start_time = task_data.get("startTime")
    end_time = task_data.get("endTime")
    if start_time and end_time:
        start_dt = datetime.fromtimestamp(start_time["seconds"])
        end_dt = datetime.fromtimestamp(end_time["seconds"])
        if end_dt <= start_dt:
            errors.append("End time must be after start time")
    
    if errors:
        return {"error": "; ".join(errors)}
    return task_data