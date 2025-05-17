import PyPDF2
import os
import pytesseract
from PIL import Image
import tempfile
import pdf2image
from .regex_patterns import extract_parameters
from src.utils.text_preprocessing import preprocess_text

class PDFExtractor:
    
    
    def __init__(self):
        self.use_ocr_fallback = True  # Set to True to try OCR if text extraction fails
    
    def extract(self, pdf_path):
        """
        Extract medical parameters from a PDF file
        
        Args:
            pdf_path (str): Path to the PDF file
            
        Returns:
            dict: Dictionary of extracted medical parameters
        """
        # First try to extract text directly
        text = self._extract_text(pdf_path)
        
        # If minimal text was extracted and OCR fallback is enabled, try OCR
        if len(text.strip()) < 100 and self.use_ocr_fallback:
            print("Text extraction yielded minimal text, trying OCR...")
            text = self._extract_text_with_ocr(pdf_path)
        
        # Preprocess the extracted text
        preprocessed_text = preprocess_text(text)
        
        # Extract parameters using regex patterns
        parameters = extract_parameters(preprocessed_text)
        
        return parameters
    
    def _extract_text(self, pdf_path):
        """Extract text from PDF using PyPDF2"""
        try:
            with open(pdf_path, 'rb') as file:
                reader = PyPDF2.PdfReader(file)
                text = ""
                for page in reader.pages:
                    text += page.extract_text() + "\n"
                return text
        except Exception as e:
            print(f"Error extracting text from PDF: {e}")
            return ""
    
    def _extract_text_with_ocr(self, pdf_path):
        """Extract text from PDF using OCR"""
        try:
            # Create a temporary directory for the images
            with tempfile.TemporaryDirectory() as temp_dir:
                # Convert PDF to images
                images = pdf2image.convert_from_path(pdf_path)
                
                full_text = ""
                for i, image in enumerate(images):
                    # Save each page as an image
                    image_path = os.path.join(temp_dir, f'page_{i}.png')
                    image.save(image_path, 'PNG')
                    
                    # Extract text using OCR
                    text = pytesseract.image_to_string(Image.open(image_path), lang='eng')
                    full_text += text + "\n"
                
                return full_text
        except Exception as e:
            print(f"Error extracting text with OCR: {e}")
            return ""