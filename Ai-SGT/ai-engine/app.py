from fastapi import FastAPI
from pydantic import BaseModel
from typing import List
import numpy as np
import joblib

app = FastAPI()

model = joblib.load("model.pkl")


class PredictionInput(BaseModel):
    studentId: int
    previousMarks: List[float]
    attendance: float = 0
    assignmentMarks: List[float] = []
    previousGpa: float = 0
    submissionDelay: float = 0


@app.post("/predict")
def predict(data: PredictionInput):
    marks = [float(mark) for mark in data.previousMarks]
    assignment_marks = [float(mark) for mark in data.assignmentMarks] or marks
    average_marks = float(np.mean(marks)) if marks else 0.0
    average_assignment = float(np.mean(assignment_marks)) if assignment_marks else 0.0

    features = [[
        float(data.attendance),
        average_marks,
        average_assignment,
        float(data.previousGpa),
        float(data.submissionDelay),
    ]]
    predicted_score = float(model.predict(features)[0])
    predicted_score = max(0.0, min(100.0, predicted_score))
    predicted_gpa = round(predicted_score / 10, 2)

    if data.attendance < 75 or predicted_score < 60:
        risk = "High"
        suggestion = "Attendance below safe level or marks are low. Improve attendance and revise weak subjects."
    elif predicted_score < 75 or data.submissionDelay > 1:
        risk = "Medium"
        suggestion = "Improve preparation and submit assignments on time."
    else:
        risk = "Low"
        suggestion = "Performance is stable. Maintain consistent study and submission habits."

    return {
        "studentId": data.studentId,
        "average": average_marks,
        "predictedScore": round(predicted_score, 2),
        "predictedGpa": predicted_gpa,
        "risk": risk,
        "suggestion": suggestion,
    }
