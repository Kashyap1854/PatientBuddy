import os
import sys
import json
from pprint import pprint

# Add project root to path
sys.path.insert(0, os.path.abspath(os.path.dirname(__file__)))

# Import your extractors
from src.extraction.pdf_extractor import PDFExtractor
from src.extraction.image_extractor import ImageExtractor
from src.extraction.text_extractor import TextExtractor

def debug_extraction():
    """Run extraction on test files and print exact extracted parameters"""
    
    # Initialize extractors
    pdf_extractor = PDFExtractor()
    image_extractor = ImageExtractor()
    text_extractor = TextExtractor()
    
    test_dir = "data/test"
    
    # Process PDF files
    pdf_dir = os.path.join(test_dir, "pdf")
    if os.path.exists(pdf_dir):
        for filename in os.listdir(pdf_dir):
            if filename.endswith(".pdf"):
                print(f"\n{'='*50}\nExtracting from PDF: {filename}\n{'='*50}")
                file_path = os.path.join(pdf_dir, filename)
                try:
                    extracted = pdf_extractor.extract(file_path)
                    print("Extracted parameters:")
                    pprint(extracted)
                except Exception as e:
                    print(f"Error extracting from {file_path}: {str(e)}")
    
    # Process image files
    img_dir = os.path.join(test_dir, "image")
    if os.path.exists(img_dir):
        for filename in os.listdir(img_dir):
            if filename.lower().endswith((".png", ".jpg", ".jpeg")):
                print(f"\n{'='*50}\nExtracting from image: {filename}\n{'='*50}")
                file_path = os.path.join(img_dir, filename)
                try:
                    extracted = image_extractor.extract(file_path)
                    print("Extracted parameters:")
                    pprint(extracted)
                except Exception as e:
                    print(f"Error extracting from {file_path}: {str(e)}")
    
    # Process text files
    txt_dir = os.path.join(test_dir, "text")
    if os.path.exists(txt_dir):
        for filename in os.listdir(txt_dir):
            if filename.endswith(".txt"):
                print(f"\n{'='*50}\nExtracting from text: {filename}\n{'='*50}")
                file_path = os.path.join(txt_dir, filename)
                try:
                    with open(file_path, 'r', encoding='utf-8') as f:
                        text = f.read()
                    extracted = text_extractor.extract(text)
                    print("Extracted parameters:")
                    pprint(extracted)
                except Exception as e:
                    print(f"Error extracting from {file_path}: {str(e)}")
    
    # Generate a template ground_truth.json based on extracted parameters
    print("\n\nTemplate for ground_truth.json:")
    ground_truth_template = {"samples": {}, "abnormal_parameters": {}}
    
    # Add all the files we found
    for doc_type in ["pdf", "image", "text"]:
        doc_dir = os.path.join(test_dir, doc_type)
        if os.path.exists(doc_dir):
            for filename in os.listdir(doc_dir):
                if ((doc_type == "pdf" and filename.endswith(".pdf")) or
                    (doc_type == "image" and filename.lower().endswith((".png", ".jpg", ".jpeg"))) or
                    (doc_type == "text" and filename.endswith(".txt"))):
                    ground_truth_template["samples"][filename] = {
                        "parameters": {},  # You'll fill these values manually
                        "type": doc_type
                    }
    
    print(json.dumps(ground_truth_template, indent=2))

if __name__ == "__main__":
    debug_extraction()