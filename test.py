from firebase_admin import credentials, firestore

# Initialize Firebase
cred = credentials.Certificate(r'C:\Users\swarg\Downloads\serviceAccountKey.json')
firebase_admin.initialize_app(cred)
db = firestore.client()

# Fetch tasks
tasks_ref = db.collection('tasks')
tasks = tasks_ref.get()

task_data = []
for task in tasks:
    task_dict = task.to_dict()
    task_dict['id'] = task.id
    task_data.append(task_dict)

print(task_data)  # Example: [{'id': 'task1', 'title': 'Review UI', 'description': 'urgent review', 'createdAt': timestamp}]