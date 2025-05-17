import os
from extraction.pdf_extractor import extract_from_pdf
from extraction.image_extractor import extract_from_image
from extraction.text_extractor import extract_from_text
from models.llm_interface import LocalLLM
from utils.cache import cache_extracted_text

from extraction.pdf_extractor import PDFExtractor
from extraction.image_extractor import ImageExtractor
from extraction.text_extractor import TextExtractor
from models.llm_interface import LLMInterface

def main():
    # Initialize the local LLM
    llm = LocalLLM()

    # Example usage: Extract data from different sources
    pdf_path = "path/to/your/file.pdf"
    image_path = "path/to/your/image.png"
    text_data = "Sample text data with medical parameters."

    # Extract medical parameters
    pdf_data = extract_from_pdf(pdf_path)
    image_data = extract_from_image(image_path)
    text_data_extracted = extract_from_text(text_data)

    # Cache the extracted text
    cache_extracted_text(pdf_data)
    cache_extracted_text(image_data)
    cache_extracted_text(text_data_extracted)

    # Example query to the LLM
    query = "Is hemoglobin 11.5 g/dL normal?"
    response = llm.query(query)
    print(response)

if __name__ == "__main__":
    main()