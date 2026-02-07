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

    return {
        "studentId": data.studentId,
        "average": avg,
        "prediction": prediction
    }
