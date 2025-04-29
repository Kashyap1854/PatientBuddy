import pandas as pd
import torch

def load_client_data(file_path):
    df = pd.read_csv(file_path)
    X = torch.tensor(df.iloc[:, :-1].values, dtype=torch.float32)
    y = torch.tensor(df.iloc[:, -1].values, dtype=torch.long)
    return X, y
