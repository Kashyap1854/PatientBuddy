
medical_ranges = {
      "Haemoglobin": {
        "normal_range": (12, 16),  # g/dL
        "unit": "g/dL"
    },
    "Hemoglobin": {
        "normal_range": (12, 16),  # g/dL
        "unit": "g/dL"
    },
    "Hb": {
        "normal_range": (12, 16),  # g/dL
        "unit": "g/dL"
    },
    "Hematocrit": {
        "normal_range": (36, 50),  # %
        "unit": "%"
    },
    "HCT": {
        "normal_range": (36, 50),  # %
        "unit": "%"
    },
    "MCV": {
        "normal_range": (80, 100),  # fL
        "unit": "fL"
    },
    "MCH": {
        "normal_range": (27, 31),  # pg
        "unit": "pg"
    },
    "WBC": {
        "normal_range": (4.0, 11.0),  # x10^9/L
        "unit": "x10^9/L"
    },
    "Platelets": {
        "normal_range": (150, 450),  # x10^9/L
        "unit": "x10^9/L"
    },
    "Glucose": {
        "normal_range": (70, 100),  # mg/dL
        "unit": "mg/dL"
    },
    "Cholesterol": {
        "normal_range": (125, 200),  # mg/dL
        "unit": "mg/dL"
    },
    "Creatinine": {
        "normal_range": (0.6, 1.2),  # mg/dL
        "unit": "mg/dL"
    }
}

def is_abnormal(parameter, value):
    if parameter in medical_ranges:
        normal_range = medical_ranges[parameter]["normal_range"]
        return not (normal_range[0] <= value <= normal_range[1])
    return None

def get_normal_range(parameter):
   
    if parameter in medical_ranges:
        return medical_ranges[parameter]["normal_range"]
    return None

def get_unit(parameter):
    
    if parameter in medical_ranges:
        return medical_ranges[parameter]["unit"]
    return None

