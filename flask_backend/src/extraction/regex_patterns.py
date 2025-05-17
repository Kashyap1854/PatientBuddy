import re

# Regex patterns for extracting medical parameters (with improved case insensitivity)
regex_patterns = {
    "Hb": re.compile(r"(hemoglobin|hb|haemoglobin)\s*[:=]?\s*(\d+\.?\d*)\s*(g/dl|g/dL)?", re.IGNORECASE),
    "WBC": re.compile(r"(white\s*blood\s*cell\s*count|wbc|leukocytes)\s*[:=]?\s*(\d+\.?\d*)\s*(cells/\u00B5l|k/mm3|x10\^3/µL)?", re.IGNORECASE),
    "Platelets": re.compile(r"(platelets|plts|plt)\s*[:=]?\s*(\d+\.?\d*)\s*(cells/\u00B5l|k/mm3|x10\^3/µL)?", re.IGNORECASE),
    "RBC": re.compile(r"(red\s*blood\s*cell\s*count|rbc|erythrocytes)\s*[:=]?\s*(\d+\.?\d*)\s*(million/\u00B5l|x10\^6/µL)?", re.IGNORECASE),
    "Hematocrit": re.compile(r"(hematocrit|hct|ht)\s*[:=]?\s*(\d+\.?\d*)\s*(%)?", re.IGNORECASE),
    "Glucose": re.compile(r"(glucose|glu|blood\s*sugar)\s*[:=]?\s*(\d+\.?\d*)\s*(mg/dl|mg/dL|mmol/L)?", re.IGNORECASE),
    "Cholesterol": re.compile(r"(cholesterol|chol)\s*[:=]?\s*(\d+\.?\d*)\s*(mg/dl|mg/dL|mmol/L)?", re.IGNORECASE),
    "Creatinine": re.compile(r"(creatinine|cre)\s*[:=]?\s*(\d+\.?\d*)\s*(mg/dl|mg/dL|µmol/L)?", re.IGNORECASE),
}

# Function to get regex pattern for a specific parameter
def get_pattern(parameter):
    return regex_patterns.get(parameter, None)

# Function to extract all medical parameters from text
def extract_parameters(text):
    """
    Extract medical parameters from text using regex patterns
    
    Args:
        text (str): Text to extract parameters from
        
    Returns:
        dict: Dictionary of extracted parameters with their values and units
    """
    results = {}
    
    for param, pattern in regex_patterns.items():
        matches = pattern.findall(text)
        if matches:
            # Use the first match (can be extended to handle multiple matches)
            match = matches[0]
            try:
                value = float(match[1])
                results[param] = {
                    "value": value,
                    "unit": match[2] if match[2] else None
                }
            except (ValueError, IndexError) as e:
                print(f"Error extracting {param}: {e}")
    
    return results