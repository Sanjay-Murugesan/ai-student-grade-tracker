import numpy as np
from sklearn.linear_model import LinearRegression
import joblib

X = []
y = []

for _ in range(1000):
    prev = np.random.randint(40, 100, size=4)
    avg = np.mean(prev)
    noise = np.random.normal(0, 4)
    predicted = avg + noise

    X.append([avg])
    y.append(predicted)

X = np.array(X)
y = np.array(y)

model = LinearRegression()
model.fit(X, y)

joblib.dump(model, "model.pkl")

print("Model trained and saved as model.pkl")
