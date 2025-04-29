from models.base_model import Net
from utils.data_loader import load_client_data
import torch
import torch.nn as nn
import torch.optim as optim

def train_client_model(file_path, model_state_dict, config):
    model = Net()
    model.load_state_dict(model_state_dict)
    
    X, y = load_client_data(file_path)
    
    optimizer = optim.SGD(model.parameters(), lr=config['lr'])
    criterion = nn.CrossEntropyLoss()
    
    model.train()
    for epoch in range(config['local_epochs']):
        optimizer.zero_grad()
        output = model(X)
        loss = criterion(output, y)
        loss.backward()
        optimizer.step()
    
    return model.state_dict()
