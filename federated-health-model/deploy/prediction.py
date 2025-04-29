import torch
from models.base_model import Net
import numpy as np

def load_model():
    model = Net()
    model.load_state_dict(torch.load("deploy/device_model.pt"))
    model.eval()
    return model

def predict(sample):
    model = load_model()
    
    input_tensor = torch.tensor([sample], dtype=torch.float32)  # 1 sample
    with torch.no_grad():
        output = model(input_tensor)
        _, predicted = torch.max(output.data, 1)
    
    return predicted.item()

if __name__ == "__main__":
    # Example: bp, glucose, cholesterol, heart_rate, oxygen, bmi, age, fatigue, fever, cough
    sample_input = [135, 145, 260, 90, 96.5, 24.3, 45, 1, 0, 1]
    
    result = predict(sample_input)
    print(f"🩺 Predicted Health Risk: {'High Risk' if result == 1 else 'Low Risk'}")
