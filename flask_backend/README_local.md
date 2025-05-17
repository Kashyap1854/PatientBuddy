# Medical AI Assistant

This project is a privacy-preserving local AI system designed to extract medical parameters from various formats (PDFs, images, and text) and provide insights based on the extracted data using a local language model (LLM).

## Features

- **Medical Parameter Extraction**: Utilizes regex and keyword lookups for fast extraction of medical parameters such as Hemoglobin (Hb), White Blood Cell count (WBC), and more from PDFs, images, and plain text.
- **Local LLM Integration**: Employs a lightweight local LLM to answer questions about the extracted medical data.
- **Abnormality Detection**: Predefined normal ranges for various medical parameters to flag abnormal values instantly.
- **Caching Mechanism**: Implements caching to avoid reprocessing of extracted text, enhancing performance.

## Project Structure

```
medical-ai-assistant
├── src
│   ├── main.py
│   ├── extraction
│   │   ├── __init__.py
│   │   ├── pdf_extractor.py
│   │   ├── image_extractor.py
│   │   ├── text_extractor.py
│   │   ├── regex_patterns.py
│   │   └── medical_ranges.py
│   ├── models
│   │   ├── __init__.py
│   │   └── llm_interface.py
│   ├── ui
│   │   ├── __init__.py
│   │   ├── app.py
│   │   └── components.py
│   └── utils
│       ├── __init__.py
│       ├── cache.py
│       └── text_preprocessing.py
├── data
│   ├── extracted
│   └── cache
├── tests
│   ├── __init__.py
│   ├── test_extraction.py
│   └── test_llm.py
├── requirements.txt
├── setup.py
└── README.md
```

## Installation

1. Clone the repository:
   ```
   git clone <repository-url>
   cd medical-ai-assistant
   ```

2. Install the required dependencies:
   ```
   pip install -r requirements.txt
   ```

## Usage

1. Run the main application:
   ```
   python src/main.py
   ```

2. Follow the prompts in the user interface to input data and receive insights.

## Contributing

Contributions are welcome! Please open an issue or submit a pull request for any enhancements or bug fixes.

## License

This project is licensed under the MIT License. See the LICENSE file for details.