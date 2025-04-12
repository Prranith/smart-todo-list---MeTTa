# import spacy
# import dateparser
# import re
# from datetime import datetime, timedelta
# from typing import Optional

# def extract_title(doc):
#     """Extract the title using NER and dependency parsing with enhanced logic."""
#     title_candidates = []

#     # Prioritize entities like EVENT, PRODUCT, or LOC (e.g., restaurant)
#     for ent in doc.ents:
#         if ent.label_ in ["EVENT", "PRODUCT", "LOC"]:
#             title_candidates.append(ent.text.strip())
#         elif ent.label_ == "PERSON" and "i" not in ent.text.lower():  # Avoid "I" as title
#             title_candidates.append(ent.text.strip())

#     # Compound nouns and noun chunks with verb context, avoiding time
#     for chunk in doc.noun_chunks:
#         if chunk.root.dep_ in ["dobj", "nsubj", "pobj"] and not re.search(r'\d{1,2}:\d{2}', chunk.text):
#             verb = next((t for t in chunk.root.head.children if t.dep_ == "ROOT"), None)
#             candidate = f"{verb.text} {chunk.text}" if verb else chunk.text
#             title_candidates.append(candidate.strip())

#     # Fallback to longest meaningful noun phrase, excluding pronouns and time
#     if not title_candidates:
#         title_candidates = [
#             chunk.text.strip() for chunk in doc.noun_chunks
#             if chunk.root.pos_ == "NOUN" and chunk.text.lower() != "i" and not re.search(r'\d{1,2}:\d{2}', chunk.text)
#         ]

#     return max(title_candidates, key=lambda x: (len(x.split()), len(x)), default="Untitled Task")

# def extract_description(voice_input: str, nlp) -> str:
#     """Extract description by removing title, time, priority, and category keywords."""
#     doc = nlp(voice_input)
#     title = extract_title(doc)
#     description = voice_input.replace(title, "").strip()

#     # Enhanced removal of time, priority, and category keywords
#     time_patterns = r"(today|tomorrow|yesterday|next week|last week|in \d+ (days?|weeks?|hours?|minutes?)|\d{1,2}(?::\d{2})?\s*(?:am|pm|a\.m\.|p\.m\.)|at \d{1,2}(?::\d{2})?\s*(?:am|pm|a\.m\.|p\.m\.)|at)"
#     priority_keywords = r"(urgent|immediately|asap|right now|critical|emergency|top priority|rush|later|someday|optional|whenever|eventually|no hurry|when free|soon|today|this week|normal|please)"
#     category_keywords = r"(meeting|office|project|call|work|team|deadline|client|presentation|report|task|doctor|hospital|medicine|health|appointment|therapy|checkup|gym|exercise|buy|market|grocery|shopping|family|friend|home|errand|party|dinner|restaurant|study|homework|class|exam|school|learn|lecture|assignment|research|pay|bill|bank|money|budget|invoice|tax|expense|payment)"
    
#     description = re.sub(
#         f"{time_patterns}|{priority_keywords}|{category_keywords}",
#         "",
#         description,
#         flags=re.IGNORECASE
#     ).strip()
    
#     # Clean up residual noise
#     description = re.sub(r'^\w+\s*', '', description).strip()
#     return description if description else ""

# def extract_start_time(text: str, nlp) -> Optional[datetime]:
#     """Extract start time with enhanced patterns, prioritizing the last time entity."""
#     text = text.lower()
#     time_patterns = [
#         r"(?:on)?\s*(monday|tuesday|wednesday|thursday|friday|saturday|sunday)\s*(?:at)?\s*(\d{1,2}(?::\d{2})?\s*(?:am|pm|a\.m\.|p\.m\.)?)",
#         r"(today|tomorrow|yesterday|next week|last week|in \d+ (days?|weeks?|hours?|minutes?))\s*(?:at)?\s*(\d{1,2}(?::\d{2})?\s*(?:am|pm|a\.m\.|p\.m\.)?)",
#         r"(\d{1,2}(?:st|nd|rd|th)?\s*(january|february|march|april|may|june|july|august|september|october|november|december)\s*(?:\d{4})?)\s*(?:at)?\s*(\d{1,2}(?::\d{2})?\s*(?:am|pm|a\.m\.|p\.m\.)?)",
#         r"(\d{1,2}/\d{1,2}(?:/\d{4})?)\s*(?:at)?\s*(\d{1,2}(?::\d{2})?\s*(?:am|pm|a\.m\.|p\.m\.)?)"
#     ]
    
#     last_matched_time = None
#     for pattern in time_patterns:
#         matches = list(re.finditer(pattern, text))
#         if matches:
#             last_match = matches[-1]  # Take the last match to prioritize the final time
#             parsed = dateparser.parse(
#                 " ".join(filter(None, last_match.groups())),
#                 settings={
#                     'PREFER_DATES_FROM': 'future',
#                     'RETURN_AS_TIMEZONE_AWARE': False,
#                     'TIMEZONE': 'UTC+5:30',
#                     'RELATIVE_BASE': datetime.now()
#                 }
#             )
#             if parsed:
#                 last_matched_time = parsed

#     if last_matched_time:
#         return last_matched_time

#     parsed_time = dateparser.parse(
#         text,
#         settings={
#             'PREFER_DATES_FROM': 'future',
#             'RETURN_AS_TIMEZONE_AWARE': False,
#             'TIMEZONE': 'UTC+5:30',
#             'RELATIVE_BASE': datetime.now()
#         }
#     )
#     if parsed_time:
#         return parsed_time

#     doc = nlp(text)
#     times = [ent for ent in doc.ents if ent.label_ == "TIME"]
#     if times:
#         return dateparser.parse(times[-1].text, settings={'TIMEZONE': 'UTC+5:30'})  # Last time entity

#     return None

# def extract_end_time(text: str, start_time: Optional[datetime], nlp) -> Optional[datetime]:
#     """Extract end time based on start time and duration cues with improved logic."""
#     if not start_time:
#         return None
    
#     text = text.lower()
#     duration_patterns = {
#         "hour": [("for an hour", 60), ("for 1 hour", 60), ("for 2 hours", 120), (r"for (\d+) hours?", lambda m: int(m.group(1)) * 60)],
#         "minute": [("for 30 minutes", 30), ("for half an hour", 30), ("for 15 minutes", 15), (r"for (\d+) minutes?", lambda m: int(m.group(1)))]
#     }
    
#     for unit, patterns in duration_patterns.items():
#         for pattern, minutes in patterns:
#             if isinstance(pattern, str) and pattern in text:
#                 return start_time + timedelta(minutes=minutes)
#             elif callable(minutes) and re.search(pattern, text):
#                 match = re.search(pattern, text)
#                 return start_time + timedelta(minutes=minutes(match))
    
#     # Fallback: Add default duration of 60 minutes if no end time is specified
#     return start_time + timedelta(minutes=60) if start_time else None

# def extract_duration(start_time: Optional[datetime], end_time: Optional[datetime]) -> Optional[int]:
#     """Calculate duration in minutes if both start and end times are valid."""
#     if start_time and end_time and end_time > start_time:
#         return int((end_time - start_time).total_seconds() / 60)
#     return 60  # Default duration of 60 minutes

# def extract_priority(text: str, nlp) -> str:
#     """Extract priority with weighted scoring and normalization."""
#     text = text.lower()
#     priority_scores = {
#     "High": (
#         [
#             'urgent', 'immediately', 'asap', 'right now', 'critical', 'emergency',
#             'top priority', 'rush', 'vital', 'crucial', 'pressing', 'must-do',
#             'high priority', 'now', 'instantly', 'priority', 'essential', 'imperative',
#             'time-sensitive', 'do now', 'critical task', 'urgent matter', 'key'
#         ], 2
#     ),
#     "Low": (
#         [
#             'later', 'someday', 'optional', 'whenever', 'eventually', 'no hurry',
#             'when free', 'not urgent', 'low priority', 'whenever possible', 'in time',
#             'at leisure', 'casual', 'relaxed', 'postpone', 'delay', 'non-critical',
#             'background', 'when convenient', 'low key', 'minor', 'nice to have'
#         ], -2
#     ),
#     "Medium": (
#         [
#             'soon', 'today', 'this week', 'normal', 'please', 'in a bit', 'shortly',
#             'this day', 'within a week', 'regular', 'standard', 'moderate', 'fair',
#             'reasonable', 'average', 'typical', 'in time', 'next few days', 'as needed',
#             'promptly', 'decently', 'fairly soon', 'okay', 'alright'
#         ], 1
#     )
# }
    
#     score = 0
#     doc = nlp(text)
#     for token in doc:
#         for priority, (keywords, weight) in priority_scores.items():
#             if token.text in keywords or any(keyword in token.text for keyword in keywords):
#                 score += weight
    
#     if score >= 3:
#         return "High"
#     elif score <= -3:
#         return "Low"
#     return "Medium"

# def extract_category(text: str, nlp) -> str:
#     """Extract category with weighted scoring and NER enhancement."""
#     text = text.lower()
#     categories = {
#         "Work": (['meeting', 'office', 'project', 'call', 'work', 'team', 'deadline', 'client', 'presentation', 'report', 'task'], 1),
#         "Health": (['doctor', 'hospital', 'medicine', 'health', 'appointment', 'therapy', 'checkup', 'gym', 'exercise'], 1),
#         "Personal": (['buy', 'market', 'grocery', 'shopping', 'family', 'friend', 'home', 'errand', 'party', 'dinner', 'restaurant'], 1),
#         "Education": (['study', 'homework', 'class', 'exam', 'school', 'learn', 'lecture', 'assignment', 'research'], 1),
#         "Finance": (['pay', 'bill', 'bank', 'money', 'budget', 'invoice', 'tax', 'expense', 'payment'], 1)
#     }
    
#     category_scores = {cat: 0 for cat in categories}
#     doc = nlp(text)
    
#     for token in doc:
#         for category, (keywords, weight) in categories.items():
#             if token.text in keywords or any(keyword in token.text for keyword in keywords):
#                 category_scores[category] += weight
#         for ent in doc.ents:
#             if ent.label_ in ["ORG", "PERSON", "EVENT", "LOC"]:
#                 if "restaurant" in text.lower() or any(kw in text for kw in categories["Personal"][0]):
#                     category_scores["Personal"] += 0.5
#                 elif "Work" in categories and any(kw in text for kw in categories["Work"][0]):
#                     category_scores["Work"] += 0.5
    
#     max_category = max(category_scores.items(), key=lambda x: x[1], default=("General", 0))
#     return max_category[0] if max_category[1] > 0 else ""
import spacy
import dateparser
import re
from datetime import datetime, timedelta
from typing import Optional

# Basic profanity filter (expand as needed)
profanity_list = ['f***', 's***', 'b****', 'a**', 'd***']
def sanitize_text(text):
    return ' '.join(word if word.lower() not in profanity_list else '[censored]' for word in text.split())

def extract_title(doc):
    """Extract the title using NER and dependency parsing with enhanced logic and sanitization."""
    title_candidates = []

    # Sanitize input to handle inappropriate content
    clean_text = sanitize_text(doc.text)

    # Prioritize entities like EVENT, PRODUCT, or LOC, and PERSON (excluding "I")
    for ent in doc.ents:
        if ent.label_ in ["EVENT", "PRODUCT", "LOC"]:
            title_candidates.append(ent.text.strip())
        elif ent.label_ == "PERSON" and "i" not in ent.text.lower():
            title_candidates.append(ent.text.strip())

    # Compound nouns and noun chunks with verb context, avoiding time and sanitizing
    for chunk in doc.noun_chunks:
        if chunk.root.dep_ in ["dobj", "nsubj", "pobj"] and not re.search(r'\d{1,2}:\d{2}', chunk.text):
            verb = next((t for t in chunk.root.head.children if t.dep_ == "ROOT"), None)
            candidate = f"{verb.text} {chunk.text}" if verb else chunk.text
            title_candidates.append(sanitize_text(candidate).strip())

    # Fallback to longest meaningful noun phrase, excluding pronouns and time
    if not title_candidates:
        title_candidates = [
            sanitize_text(chunk.text).strip() for chunk in doc.noun_chunks
            if chunk.root.pos_ == "NOUN" and chunk.text.lower() != "i" and not re.search(r'\d{1,2}:\d{2}', chunk.text)
        ]

    return max(title_candidates, key=lambda x: (len(x.split()), len(x)), default="Untitled Task")

def extract_description(voice_input: str, nlp) -> str:
    """Extract description by removing title, time, priority, and category keywords with sanitization."""
    doc = nlp(voice_input)
    title = extract_title(doc)
    description = voice_input.replace(title, "").strip()

    # Sanitize description
    description = sanitize_text(description)

    # Enhanced removal of time, priority, and category keywords
    time_patterns = r"(today|tomorrow|yesterday|next week|last week|in \d+ (days?|weeks?|hours?|minutes?)|\d{1,2}(?::\d{2})?\s*(?:am|pm|a\.m\.|p\.m\.)|at \d{1,2}(?::\d{2})?\s*(?:am|pm|a\.m\.|p\.m\.)|from|to|at)"
    priority_keywords = r"(urgent|immediately|asap|right now|critical|emergency|top priority|rush|later|someday|optional|whenever|eventually|no hurry|when free|soon|today|this week|normal|please)"
    category_keywords = r"(meeting|office|project|call|work|team|deadline|client|presentation|report|task|doctor|hospital|medicine|health|appointment|therapy|checkup|gym|exercise|buy|market|grocery|shopping|family|friend|home|errand|party|dinner|restaurant|study|homework|class|exam|school|learn|lecture|assignment|research|pay|bill|bank|money|budget|invoice|tax|expense|payment)"
    
    description = re.sub(
        f"{time_patterns}|{priority_keywords}|{category_keywords}",
        "",
        description,
        flags=re.IGNORECASE
    ).strip()
    
    # Clean up residual noise
    description = re.sub(r'^\w+\s*', '', description).strip()
    return description if description else ""

def extract_start_time(text: str, nlp) -> Optional[datetime]:
    """Extract start time with enhanced patterns, handling ranges like 'from ... to ...' with day context."""
    text = text.lower()
    # Check for "today" to anchor the date
    today_match = re.search(r"\btoday\b", text)
    base_date = datetime.now().replace(hour=0, minute=0, second=0, microsecond=0) if today_match else datetime.now()

    time_patterns = [
        r"(?:on)?\s*(monday|tuesday|wednesday|thursday|friday|saturday|sunday)\s*(?:at)?\s*(\d{1,2}(?::\d{2})?\s*(?:am|pm|a\.m\.|p\.m\.)?)",
        r"(today|tomorrow|yesterday|next week|last week|in \d+ (days?|weeks?|hours?|minutes?))\s*(?:at)?\s*(\d{1,2}(?::\d{2})?\s*(?:am|pm|a\.m\.|p\.m\.)?)",
        r"(\d{1,2}/\d{1,2}(?:/\d{4})?)\s*(?:at)?\s*(\d{1,2}(?::\d{2})?\s*(?:am|pm|a\.m\.|p\.m\.)?)",
        r"from\s+(\d{1,2}(?::\d{2})?\s*(?:am|pm|a\.m\.|p\.m\.))",  # Match 'from' time
        r"at\s+(\d{1,2}(?::\d{2})?\s*(?:am|pm|a\.m\.|p\.m\.))"    # Match standalone 'at' time
    ]
    
    last_matched_time = None
    for pattern in time_patterns:
        matches = list(re.finditer(pattern, text))
        if matches:
            last_match = matches[-1]  # Take the last match to prioritize the final time
            time_str = last_match.group(1) or last_match.group(2)  # Extract the time part
            if time_str:
                parsed = dateparser.parse(
                    time_str,
                    settings={
                        'PREFER_DATES_FROM': 'current_period',
                        'RETURN_AS_TIMEZONE_AWARE': False,
                        'TIMEZONE': 'UTC+5:30',
                        'RELATIVE_BASE': base_date
                    }
                )
                if parsed:
                    last_matched_time = parsed

    if last_matched_time:
        return last_matched_time

    # Check for range 'from ... to ...'
    range_match = re.search(r"from\s+(\d{1,2}(?::\d{2})?\s*(?:am|pm|a\.m\.|p\.m\.))\s+to\s+(\d{1,2}(?::\d{2})?\s*(?:am|pm|a\.m\.|p\.m\.))", text)
    if range_match:
        start_time_str = range_match.group(1)
        parsed_start = dateparser.parse(
            start_time_str,
            settings={
                'PREFER_DATES_FROM': 'current_period',
                'RETURN_AS_TIMEZONE_AWARE': False,
                'TIMEZONE': 'UTC+5:30',
                'RELATIVE_BASE': base_date
            }
        )
        if parsed_start:
            return parsed_start

    parsed_time = dateparser.parse(
        text,
        settings={
            'PREFER_DATES_FROM': 'current_period',
            'RETURN_AS_TIMEZONE_AWARE': False,
            'TIMEZONE': 'UTC+5:30',
            'RELATIVE_BASE': base_date
        }
    )
    if parsed_time:
        return parsed_time

    doc = nlp(text)
    times = [ent for ent in doc.ents if ent.label_ == "TIME"]
    if times:
        return dateparser.parse(times[0].text, settings={'TIMEZONE': 'UTC+5:30'})  # Use first time entity as fallback

    return None

def extract_end_time(text: str, start_time: Optional[datetime], nlp) -> Optional[datetime]:
    """Extract end time based on start time and range cues with improved logic and validation."""
    if not start_time:
        return None
    
    text = text.lower()
    # Check for range 'from ... to ...'
    range_match = re.search(r"from\s+(\d{1,2}(?::\d{2})?\s*(?:am|pm|a\.m\.|p\.m\.))\s+to\s+(\d{1,2}(?::\d{2})?\s*(?:am|pm|a\.m\.|p\.m\.))", text)
    if range_match:
        end_time_str = range_match.group(2)
        parsed_end = dateparser.parse(
            end_time_str,
            settings={
                'PREFER_DATES_FROM': 'current_period',
                'RETURN_AS_TIMEZONE_AWARE': False,
                'TIMEZONE': 'UTC+5:30',
                'RELATIVE_BASE': datetime.now().replace(hour=start_time.hour, minute=start_time.minute, second=0)
            }
        )
        if parsed_end:
            # Adjust for day transition based on AM/PM and chronological order
            if parsed_end.time() < start_time.time() and parsed_end.hour < 12 and start_time.hour >= 12:
                parsed_end = parsed_end + timedelta(days=1)  # Next day for AM after PM
            elif parsed_end.time() < start_time.time() and parsed_end.hour >= 12 and start_time.hour < 12:
                parsed_end = parsed_end - timedelta(days=1)  # Previous day for PM before AM
            elif parsed_end.time() < start_time.time():  # Handle midnight crossing (e.g., 10 PM to 1 AM)
                parsed_end = parsed_end + timedelta(days=1)
            return parsed_end

    # Fallback to duration-based patterns
    duration_patterns = {
        "hour": [("for an hour", 60), ("for 1 hour", 60), ("for 2 hours", 120), (r"for (\d+) hours?", lambda m: int(m.group(1)) * 60)],
        "minute": [("for 30 minutes", 30), ("for half an hour", 30), ("for 15 minutes", 15), (r"for (\d+) minutes?", lambda m: int(m.group(1)))]
    }
    
    for unit, patterns in duration_patterns.items():
        for pattern, minutes in patterns:
            if isinstance(pattern, str) and pattern in text:
                return start_time + timedelta(minutes=minutes)
            elif callable(minutes) and re.search(pattern, text):
                match = re.search(pattern, text)
                return start_time + timedelta(minutes=minutes(match))
    
    # Default duration of 60 minutes if no end time is specified
    return start_time + timedelta(minutes=60)

def extract_duration(start_time: Optional[datetime], end_time: Optional[datetime]) -> Optional[int]:
    """Calculate duration in minutes if both start and end times are valid, with validation."""
    if start_time and end_time:
        if end_time < start_time:
            end_time = end_time + timedelta(days=1)  # Adjust for day wraparound
        if end_time > start_time:
            return int((end_time - start_time).total_seconds() / 60)
    return 60  # Default duration of 60 minutes

def extract_priority(text: str, nlp) -> str:
    """Extract priority with weighted scoring and normalization."""
    text = text.lower()
    priority_scores = {
        "High": (
            [
                'urgent', 'immediately', 'asap', 'right now', 'critical', 'emergency',
                'top priority', 'rush', 'vital', 'crucial', 'pressing', 'must-do',
                'high priority', 'now', 'instantly', 'priority', 'essential', 'imperative',
                'time-sensitive', 'do now', 'critical task', 'urgent matter', 'key'
            ], 2
        ),
        "Low": (
            [
                'later', 'someday', 'optional', 'whenever', 'eventually', 'no hurry',
                'when free', 'not urgent', 'low priority', 'whenever possible', 'in time',
                'at leisure', 'casual', 'relaxed', 'postpone', 'delay', 'non-critical',
                'background', 'when convenient', 'low key', 'minor', 'nice to have'
            ], -2
        ),
        "Medium": (
            [
                'soon', 'today', 'this week', 'normal', 'please', 'in a bit', 'shortly',
                'this day', 'within a week', 'regular', 'standard', 'moderate', 'fair',
                'reasonable', 'average', 'typical', 'in time', 'next few days', 'as needed',
                'promptly', 'decently', 'fairly soon', 'okay', 'alright'
            ], 1
        )
    }
    
    score = 0
    doc = nlp(text)
    for token in doc:
        for priority, (keywords, weight) in priority_scores.items():
            if token.text in keywords or any(keyword in token.text for keyword in keywords):
                score += weight
    
    if score >= 3:
        return "High"
    elif score <= -3:
        return "Low"
    return "Medium"

def extract_category(text: str, nlp) -> str:
    """Extract category with weighted scoring and NER enhancement."""
    text = text.lower()
    categories = {
        "Work": (['meeting', 'office', 'project', 'call', 'work', 'team', 'deadline', 'client', 'presentation', 'report', 'task'], 1),
        "Health": (['doctor', 'hospital', 'medicine', 'health', 'appointment', 'therapy', 'checkup', 'gym', 'exercise'], 1),
        "Personal": (['buy', 'market', 'grocery', 'shopping', 'family', 'friend', 'home', 'errand', 'party', 'dinner', 'restaurant'], 1),
        "Education": (['study', 'homework', 'class', 'exam', 'school', 'learn', 'lecture', 'assignment', 'research'], 1),
        "Finance": (['pay', 'bill', 'bank', 'money', 'budget', 'invoice', 'tax', 'expense', 'payment'], 1)
    }
    
    category_scores = {cat: 0 for cat in categories}
    doc = nlp(text)
    
    for token in doc:
        for category, (keywords, weight) in categories.items():
            if token.text in keywords or any(keyword in token.text for keyword in keywords):
                category_scores[category] += weight
        for ent in doc.ents:
            if ent.label_ in ["ORG", "PERSON", "EVENT", "LOC"]:
                if "restaurant" in text.lower() or any(kw in text for kw in categories["Personal"][0]):
                    category_scores["Personal"] += 0.5
                elif "Work" in categories and any(kw in text for kw in categories["Work"][0]):
                    category_scores["Work"] += 0.5
    
    max_category = max(category_scores.items(), key=lambda x: x[1], default=("General", 0))
    return max_category[0] if max_category[1] > 0 else ""