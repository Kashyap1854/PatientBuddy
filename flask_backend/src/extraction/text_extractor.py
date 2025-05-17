from .regex_patterns import extract_parameters
from src.utils.text_preprocessing import preprocess_text

class TextExtractor:
    """Extracts medical parameters from plain text"""
    
    def __init__(self):
        pass
    
    def extract(self, text):
        """
        Extract medical parameters from text
        
        Args:
            text (str): Text to extract from
            
        Returns:
            dict: Dictionary of extracted medical parameters
        """
        # Preprocess the text
        preprocessed_text = preprocess_text(text)
        
        # Extract parameters using regex patterns
        parameters = extract_parameters(preprocessed_text)
        
        return parameters