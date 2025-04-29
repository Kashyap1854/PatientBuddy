import shutil
import os

def download_model():
    src = "models/trained_model.pt"
    dst = "deploy/device_model.pt"

    if not os.path.exists(src):
        raise FileNotFoundError("❌ Trained model not found. Please train it first.")

    os.makedirs("deploy", exist_ok=True)
    shutil.copyfile(src, dst)
    print("✅ Model downloaded to device successfully!")

if __name__ == "__main__":
    download_model()
