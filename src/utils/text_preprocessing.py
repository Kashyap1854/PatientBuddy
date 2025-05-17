def preprocess_text(text):
    # Convert text to lowercase
    text = text.lower()
    
    # Remove any unwanted characters (e.g., special characters)
    text = ''.join(char for char in text if char.isalnum() or char.isspace())
    
    # Strip leading and trailing whitespace
    text = text.strip()
    
    return text

def split_into_sentences(text):
    # Simple sentence splitting based on periods
    sentences = text.split('.')
    return [sentence.strip() for sentence in sentences if sentence.strip()]