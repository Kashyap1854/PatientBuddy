import pytesseract
from PIL import Image
import cv2
import numpy as np
from .regex_patterns import extract_parameters
from src.utils.text_preprocessing import preprocess_text

class ImageExtractor:
    
    
    def __init__(self):

        pass
    
    def extract(self, image_path):
        """
        Extract medical parameters from an image file
        
        Args:
            image_path (str): Path to the image file
            
        Returns:
            dict: Dictionary of extracted medical parameters
        """
        
        text = self._extract_text(image_path)
        
        
        if len(text.strip()) < 50:
            text = self._extract_text_with_preprocessing(image_path)
        
        
        preprocessed_text = preprocess_text(text)
        
      
        parameters = extract_parameters(preprocessed_text)
        
        return parameters
    
    def _extract_text(self, image_path):
        
        try:
            return pytesseract.image_to_string(Image.open(image_path), lang='eng')
        except Exception as e:
            print(f"Error extracting text from image: {e}")
            return ""
    
    def _extract_text_with_preprocessing(self, image_path):
        
        try:
            
            img = cv2.imread(image_path)
            
            gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
            
            
            _, thresh = cv2.threshold(gray, 0, 255, cv2.THRESH_BINARY_INV + cv2.THRESH_OTSU)
            
           
            thresh = 255 - thresh
            
          
            pil_img = Image.fromarray(thresh)
            
            return pytesseract.image_to_string(pil_img, lang='eng')
        except Exception as e:
            print(f"Error extracting text with preprocessing: {e}")
            return ""