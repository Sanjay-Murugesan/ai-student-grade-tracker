from fastapi import FastAPI
from pydantic import BaseModel
from typing import List
import numpy as np
import joblib

app = FastAPI()

# Load model
model = joblib.load("model.pkl")

class MarksInput(BaseModel):
    studentId: int
    previousMarks: List[float]

@app.post("/predict")
def predict(data: MarksInput):
    marks = [float(m) for m in data.previousMarks]
    avg = float(np.mean(marks))
    prediction = model.predict([[avg]])[0]

    # Determine risk level based on prediction
    if prediction < 50:
        risk = "High Risk"
        suggestion = "Student needs immediate attention and additional support."
    elif prediction < 70:
        risk = "Medium Risk"
        suggestion = "Student should focus on improving study habits."
    else:
        risk = "Low Risk"
        suggestion = "Student is performing well, continue current efforts."

    return {
        "studentId": data.studentId,
        "predictedScore": prediction,
        "risk": risk,
        "suggestion": suggestion
    }
