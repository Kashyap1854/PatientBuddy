import copy

def federated_avg(state_dicts):
    avg_state = copy.deepcopy(state_dicts[0])
    for key in avg_state.keys():
        for i in range(1, len(state_dicts)):
            avg_state[key] += state_dicts[i][key]
        avg_state[key] = torch.div(avg_state[key], len(state_dicts))
    return avg_state
