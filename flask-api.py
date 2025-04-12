# from flask import Flask, request, jsonify
# import logging
# from datetime import datetime, timedelta, timezone
# import sys
# from extractors import (
#     extract_title, extract_description, extract_start_time, extract_end_time,
#     extract_duration, extract_priority, extract_category
# )
# from utils import to_firestore_timestamp

# # Configure logging
# logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
# logger = logging.getLogger(__name__)

# app = Flask(__name__)

# # Load spaCy model globally
# try:
#     global nlp
#     import spacy
#     nlp = spacy.load("en_core_web_lg")
#     logger.info("spaCy model 'en_core_web_lg' loaded successfully")
# except OSError:
#     logger.error("Model 'en_core_web_lg' not found. Please run 'python -m spacy download en_core_web_lg'")
#     sys.exit(1)

# def format_timestamp(dt):
#     """Convert datetime to ISO 8601 string in UTC+5:30."""
#     if dt:
#         return dt.astimezone(timezone(timedelta(hours=5, minutes=30))).isoformat()
#     return None

# @app.route('/parse-task', methods=['POST'])
# def parse_task():
#     """Parse voice input into a structured task object with manual task format.
    
#     Args:
#         request.json (dict): Should contain 'voice_input' key with the voice command string.
#                             Optional 'title' key for manual override.
    
#     Returns:
#         JSON: Task data formatted as ISO 8601 strings for timestamps, matching manual add task screen.
#     """
#     try:
#         data = request.get_json()
#         if not data or 'voice_input' not in data:
#             logger.error("No voice_input provided in request")
#             return jsonify({"error": "No voice_input provided"}), 400

#         voice_input = data['voice_input'].strip()
#         if not voice_input:
#             logger.error("Empty voice_input provided")
#             return jsonify({"error": "Empty voice_input provided"}), 400

#         logger.info(f"Processing voice input: {voice_input}")

#         # Preprocess voice input to remove noise
#         voice_input = re.sub(r'^\s*hd\s*', '', voice_input, flags=re.IGNORECASE).strip()

#         # Extract components with nlp passed as argument
#         doc = nlp(voice_input.lower())
#         title = data.get('title', extract_title(doc))  # Allow manual title override
#         description = extract_description(voice_input, nlp)
#         start_time = extract_start_time(voice_input, nlp)
#         end_time = extract_end_time(voice_input, start_time, nlp) if start_time else None
#         duration = extract_duration(start_time, end_time) or 60  # Default to 60 minutes if not detected
#         priority = extract_priority(voice_input, nlp)
#         category = extract_category(voice_input, nlp)
#         created_at = datetime.now(timezone(timedelta(hours=5, minutes=30)))  # Use UTC+5:30

#         # Build task data with ISO 8601 timestamps
#         task_data = {
#             "title": title,
#             "description": description if description != "" else "",
#             "startTime": format_timestamp(start_time),
#             "endTime": format_timestamp(end_time),
#             "duration": duration,
#             "priority": priority,
#             "category": category if category != "General" else "",
#             "completed": False,
#             "createdAt": format_timestamp(created_at)
#         }

#         logger.info(f"Successfully parsed task: {task_data}")
#         return jsonify(task_data)

#     except Exception as e:
#         logger.error(f"Unexpected error: {str(e)}", exc_info=True)
#         return jsonify({"error": "Internal server error", "details": str(e)}), 500

# if __name__ == '__main__':
#     import re  # Added for preprocessing
#     app.run(host='0.0.0.0', port=5000, debug=True)
from flask import Flask, request, jsonify
import logging
from datetime import datetime, timedelta, timezone
import sys
from extractors import (
    extract_title, extract_start_time, extract_end_time,
    extract_duration, extract_priority, extract_category
)
from utils import to_firestore_timestamp

# Configure logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

app = Flask(__name__)

# Load spaCy model globally
try:
    global nlp
    import spacy
    nlp = spacy.load("en_core_web_lg")
    logger.info("spaCy model 'en_core_web_lg' loaded successfully")
except OSError:
    logger.error("Model 'en_core_web_lg' not found. Please run 'python -m spacy download en_core_web_lg'")
    sys.exit(1)

def format_timestamp(dt):
    """Convert datetime to ISO 8601 string in UTC+5:30."""
    if dt:
        return dt.astimezone(timezone(timedelta(hours=5, minutes=30))).isoformat()
    return None

@app.route('/parse-task', methods=['POST'])
def parse_task():
    """Parse voice input into a structured task object with manual task format.
    
    Args:
        request.json (dict): Should contain 'voice_input' key with the voice command string.
                            Optional 'title' key for manual override.
    
    Returns:
        JSON: Task data formatted as ISO 8601 strings for timestamps, matching manual add task screen.
    """
    try:
        data = request.get_json()
        if not data or 'voice_input' not in data:
            logger.error("No voice_input provided in request")
            return jsonify({"error": "No voice_input provided"}), 400

        voice_input = data['voice_input'].strip()
        if not voice_input:
            logger.error("Empty voice_input provided")
            return jsonify({"error": "Empty voice_input provided"}), 400

        logger.info(f"Processing voice input: {voice_input}")

        # Preprocess voice input to remove noise
        voice_input = re.sub(r'^\s*hd\s*', '', voice_input, flags=re.IGNORECASE).strip()

        # Extract components with nlp passed as argument
        doc = nlp(voice_input.lower())
        title = data.get('title', extract_title(doc))  # Allow manual title override
        description = voice_input  # Use raw voice_input as description
        start_time = extract_start_time(voice_input, nlp)
        end_time = extract_end_time(voice_input, start_time, nlp) if start_time else None
        duration = extract_duration(start_time, end_time) or 60  # Default to 60 minutes if not detected
        priority = extract_priority(voice_input, nlp)
        category = extract_category(voice_input, nlp)
        created_at = datetime.now(timezone(timedelta(hours=5, minutes=30)))  # Use UTC+5:30

        # Build task data with ISO 8601 timestamps
        task_data = {
            "title": title,
            "description": description if description != "" else "",
            "startTime": format_timestamp(start_time),
            "endTime": format_timestamp(end_time),
            "duration": duration,
            "priority": priority,
            "category": category if category != "General" else "",
            "completed": False,
            "createdAt": format_timestamp(created_at)
        }

        logger.info(f"Successfully parsed task: {task_data}")
        return jsonify(task_data)

    except Exception as e:
        logger.error(f"Unexpected error: {str(e)}", exc_info=True)
        return jsonify({"error": "Internal server error", "details": str(e)}), 500

if __name__ == '__main__':
    import re  # Added for preprocessing
    app.run(host='0.0.0.0', port=5000, debug=True)