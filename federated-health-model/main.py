from models.base_model import Net
from clients.client import train_client_model
from server.aggregator import federated_avg
import torch

client_files = ["../data/client_1.csv", "../data/client_2.csv"]
global_model = Net()
config = {
    'lr': 0.01,
    'local_epochs': 5,
    'rounds': 3
}

for rnd in range(config['rounds']):
    print(f"\n--- Round {rnd+1} ---")
    local_states = []
    for file in client_files:
        updated_model = train_client_model(file, global_model.state_dict(), config)
        local_states.append(updated_model)

    global_model.load_state_dict(federated_avg(local_states))

# Save final model
torch.save(global_model.state_dict(), 'models/trained_model.pt')
print("\n✅ Training complete. Model saved!")
