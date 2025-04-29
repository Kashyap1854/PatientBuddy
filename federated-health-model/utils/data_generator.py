import pandas as pd
import numpy as np
import os

def generate_dummy_data(filename, num_samples=100):
    np.random.seed(42)

    # Simulated health features
    data = {
        "bp": np.random.randint(80, 150, num_samples),               # Blood Pressure
        "glucose": np.random.randint(70, 200, num_samples),          # Glucose
        "cholesterol": np.random.randint(150, 300, num_samples),     # Cholesterol
        "heart_rate": np.random.randint(60, 120, num_samples),       # Heart rate
        "oxygen": np.random.uniform(92, 100, num_samples),           # SpO2
        "bmi": np.random.uniform(18, 35, num_samples),               # BMI
        "age": np.random.randint(20, 80, num_samples),               # Age
        "symptom_fatigue": np.random.randint(0, 2, num_samples),     # Binary symptom flags
        "symptom_fever": np.random.randint(0, 2, num_samples),
        "symptom_cough": np.random.randint(0, 2, num_samples)
    }

    # Label: basic rule-based simulation
    df = pd.DataFrame(data)
    df["label"] = ((df["bp"] > 130) & (df["cholesterol"] > 240) | (df["glucose"] > 180)).astype(int)

    df.to_csv(filename, index=False)
    print(f"✅ Generated dummy data: {filename}")

# Generate data files
if __name__ == "__main__":
    os.makedirs("data", exist_ok=True)
    generate_dummy_data("data/client_1.csv")
    generate_dummy_data("data/client_2.csv")
