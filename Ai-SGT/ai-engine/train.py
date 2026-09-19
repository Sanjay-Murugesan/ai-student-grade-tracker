import numpy as np
from sklearn.ensemble import RandomForestRegressor
import joblib

X = []
y = []

for _ in range(2500):
    attendance = np.random.uniform(45, 100)
    internal_marks = np.random.uniform(30, 100)
    assignment_marks = np.random.uniform(30, 100)
    previous_gpa = np.random.uniform(4, 10)
    submission_delay = np.random.randint(0, 6)

    predicted = (
        attendance * 0.25
        + internal_marks * 0.35
        + assignment_marks * 0.20
        + previous_gpa * 10 * 0.18
        - submission_delay * 2.0
        + np.random.normal(0, 3)
    )

    X.append([attendance, internal_marks, assignment_marks, previous_gpa, submission_delay])
    y.append(max(0, min(100, predicted)))

model = RandomForestRegressor(n_estimators=120, random_state=42)
model.fit(np.array(X), np.array(y))

joblib.dump(model, "model.pkl")

print("Random Forest model trained and saved as model.pkl")
