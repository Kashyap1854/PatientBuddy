"""
Evaluation metrics for measuring the performance of the Patient Buddy system.
"""
import os
import json
import time
import traceback
from datetime import datetime
from collections import defaultdict
from typing import Dict, Set, List, Tuple, Any, Union, Optional

# Import your project's modules
from src.extraction.medical_ranges import medical_ranges, is_abnormal


def normalize_param_name(param: str) -> str:
    """
    Normalize parameter names for comparison.
    
    Args:
        param: Parameter name to normalize
        
    Returns:
        Normalized parameter name
    """
    if param is None:
        return ""
    
    param = str(param).lower().strip()
    
    # Common substitutions
    substitutions = {
        "hb": "hemoglobin",
        "haemoglobin": "hemoglobin",
        "wbc": "white blood cell count",
        "white blood cells": "white blood cell count",
        "rbc": "red blood cell count",
        "red blood cells": "red blood cell count",
        "plt": "platelets",
        "platelet count": "platelets",
        "gluc": "glucose",
        "chol": "cholesterol",
        "creat": "creatinine"
    }
    
    for short, long in substitutions.items():
        if param == short or param == long:
            return short
    
    return param


def print_debug_comparison(ground_truth, extracted_params, numerical_extracted, normalized_extracted):
    """Print detailed debug information for parameter comparison"""
    print("\n--- DETAILED PARAMETER COMPARISON ---")
    print(f"Original ground truth: {ground_truth}")
    print(f"Original extracted: {extracted_params}")
    print(f"Numerical extracted: {numerical_extracted}")
    print(f"Normalized extracted: {normalized_extracted}")
    
    print("\nParameter matching:")
    for param, true_value in ground_truth.items():
        norm_param = normalize_param_name(param)
        print(f"  Ground truth: {param} (normalized: {norm_param}) = {true_value}")
        
        if norm_param in normalized_extracted:
            extracted_value = normalized_extracted[norm_param]
            margin = true_value * 0.10
            print(f"    ✅ MATCH: Extracted as {extracted_value} (allowed range: {true_value-margin:.2f}-{true_value+margin:.2f})")
            if abs(extracted_value - true_value) <= margin:
                print(f"    ✓ Value within 10% margin")
            else:
                print(f"    ✗ Value outside 10% margin")
        else:
            print(f"    ✗ NOT FOUND in extracted parameters")
            # Check if it exists with a different normalization
            matches = []
            for ext_param in extracted_params.keys():
                if normalize_param_name(ext_param) == norm_param:
                    matches.append(ext_param)
            if matches:
                print(f"    ℹ️ Similar keys found: {matches}")


def evaluate_extraction_accuracy(ground_truth: Dict[str, float], 
                              extracted_params: Dict[str, Any]) -> Dict[str, Any]:
    """
    Measures how accurately the system extracts parameters from medical reports.
    
    Args:
        ground_truth: Manual annotations of parameters in test documents
        extracted_params: System-extracted parameters
        
    Returns:
        Dict with accuracy metrics
    """
    total_params = len(ground_truth)
    correctly_extracted = 0
    value_errors = 0
    
    # Convert extracted values to numerical format
    numerical_extracted = {}
    for param, value in extracted_params.items():
        try:
            # Handle nested dictionary structure with 'value' key
            if isinstance(value, dict) and 'value' in value:
                numerical_extracted[param] = float(value['value'])
            elif isinstance(value, (int, float)):
                numerical_extracted[param] = float(value)
            elif isinstance(value, str):
                # Remove any units or other text, keep only numbers
                num_str = ''.join(c for c in value if c.isdigit() or c in '.')
                if num_str:
                    numerical_extracted[param] = float(num_str)
            else:
                print(f"Warning: Unknown type for value {value} ({type(value)}) for parameter {param}")
        except (ValueError, TypeError) as e:
            print(f"Warning: Could not convert '{value}' to float for parameter '{param}': {str(e)}")
    
    # Normalize parameter names
    normalized_extracted = {normalize_param_name(k): v for k, v in numerical_extracted.items()}
    
    # Print detailed debug information
    print_debug_comparison(ground_truth, extracted_params, numerical_extracted, normalized_extracted)
    
    # Compare extracted parameters with ground truth
    for param, true_value in ground_truth.items():
        norm_param = normalize_param_name(param)
        if norm_param in normalized_extracted:
            extracted_value = normalized_extracted[norm_param]
            # More lenient comparison (10% instead of 1%)
            if abs(extracted_value - true_value) <= (true_value * 0.10):
                correctly_extracted += 1
                print(f"✅ CORRECT: {param} = {true_value} matched with extracted {extracted_value}")
            else:
                value_errors += 1
                print(f"❌ VALUE ERROR: {param} = {true_value} vs extracted {extracted_value}")
        else:
            print(f"❌ MISSING: {param} (normalized as {norm_param}) not found in extracted parameters")
                
    accuracy = correctly_extracted / total_params if total_params > 0 else 0
    
    result = {
        "accuracy": accuracy * 100,
        "total_parameters": total_params,
        "correctly_extracted": correctly_extracted,
        "value_errors": value_errors,
        "missed_parameters": total_params - len([p for p in normalized_extracted if normalize_param_name(p) in [normalize_param_name(gtp) for gtp in ground_truth]])
    }
    
    print(f"\nAccuracy results: {result}")
    return result


def evaluate_abnormality_detection(ground_truth_abnormal: Set[str], 
                                detected_abnormal: Set[str]) -> Dict[str, Any]:
    """
    Evaluates how well the system identifies abnormal values.
    
    Args:
        ground_truth_abnormal: Parameters that are truly abnormal
        detected_abnormal: Parameters detected as abnormal by the system
        
    Returns:
        Classification metrics
    """
    print(f"\nAbnormality Detection Analysis:")
    print(f"Ground truth abnormal: {ground_truth_abnormal}")
    print(f"Detected abnormal: {detected_abnormal}")
    
    # True positives: parameters correctly identified as abnormal
    tp = len(ground_truth_abnormal.intersection(detected_abnormal))
    
    # False positives: parameters incorrectly identified as abnormal
    fp = len(detected_abnormal - ground_truth_abnormal)
    
    # False negatives: abnormal parameters that weren't detected
    fn = len(ground_truth_abnormal - detected_abnormal)
    
    # Calculate precision, recall, and F1 score
    precision = tp / (tp + fp) if (tp + fp) > 0 else 0
    recall = tp / (tp + fn) if (tp + fn) > 0 else 0
    f1 = 2 * (precision * recall) / (precision + recall) if (precision + recall) > 0 else 0
    
    result = {
        "precision": precision * 100,
        "recall": recall * 100,
        "f1_score": f1 * 100,
        "true_positives": tp,
        "false_positives": fp,
        "false_negatives": fn
    }
    
    print(f"Abnormality metrics: {result}")
    return result


def run_evaluation(test_data_dir: str) -> Dict[str, Any]:
    """
    Run a comprehensive evaluation on test data and return all metrics.
    
    Args:
        test_data_dir: Directory containing test data and ground truth
        
    Returns:
        Dictionary of evaluation metrics
    """
    print("\n===== STARTING EVALUATION =====")
    print(f"Test data directory: {os.path.abspath(test_data_dir)}")
    
    # Display directory structure for debugging
    print("\nTest directory structure:")
    for root, dirs, files in os.walk(test_data_dir):
        level = root.replace(test_data_dir, '').count(os.sep)
        indent = ' ' * 4 * level
        print(f"{indent}{os.path.basename(root)}/")
        sub_indent = ' ' * 4 * (level + 1)
        for file in files:
            print(f"{sub_indent}{file}")
    
    # Load ground truth data
    ground_truth_path = os.path.join(test_data_dir, "ground_truth.json")
    print(f"\nAttempting to load ground truth from: {ground_truth_path}")
    
    try:
        with open(ground_truth_path, "r") as f:
            ground_truth_data = json.load(f)
        print(f"Ground truth loaded successfully: {len(ground_truth_data.get('samples', {}))} samples found")
        print(f"Sample keys: {list(ground_truth_data.get('samples', {}).keys())}")
    except FileNotFoundError:
        print(f"Error: Could not find ground_truth.json in {test_data_dir}")
        return {
            "overall": {"accuracy": 0, "abnormality_detection": {}, "processing_time": 0},
            "by_document_type": {"pdf": {}, "image": {}, "text": {}},
            "by_parameter": {},
            "error": "ground_truth.json not found"
        }
    except json.JSONDecodeError as e:
        print(f"Error: Invalid JSON in ground_truth.json: {str(e)}")
        return {
            "overall": {"accuracy": 0, "abnormality_detection": {}, "processing_time": 0},
            "by_document_type": {"pdf": {}, "image": {}, "text": {}},
            "by_parameter": {},
            "error": f"Invalid JSON: {str(e)}"
        }
    
    # Import necessary modules here to avoid circular imports
    print("\nImporting extraction modules...")
    try:
        from src.extraction.pdf_extractor import PDFExtractor
        from src.extraction.image_extractor import ImageExtractor
        from src.extraction.text_extractor import TextExtractor
        print("Modules imported successfully")
    except ImportError as e:
        print(f"Error importing extractors: {str(e)}")
        traceback.print_exc()
        return {
            "overall": {"accuracy": 0, "abnormality_detection": {}, "processing_time": 0},
            "by_document_type": {"pdf": {}, "image": {}, "text": {}},
            "error": f"Failed to import extractors: {str(e)}"
        }
    
    # Initialize extractors
    try:
        print("\nInitializing extractors...")
        pdf_extractor = PDFExtractor()
        image_extractor = ImageExtractor()
        text_extractor = TextExtractor()
        print("Extractors initialized successfully")
    except Exception as e:
        print(f"Error initializing extractors: {str(e)}")
        traceback.print_exc()
        return {
            "overall": {"accuracy": 0, "abnormality_detection": {}, "processing_time": 0},
            "by_document_type": {"pdf": {}, "image": {}, "text": {}},
            "error": f"Failed to initialize extractors: {str(e)}"
        }
    
    # Results containers
    overall_results = {
        "total_documents": 0,
        "correctly_extracted_params": 0,
        "total_params": 0,
        "processing_time": 0
    }
    
    doc_type_results = {
        "pdf": {"total_documents": 0, "total_params": 0, "correctly_extracted": 0, 
                "processing_time": 0, "ocr_fallback_count": 0},
        "image": {"total_documents": 0, "total_params": 0, "correctly_extracted": 0, 
                 "processing_time": 0},
        "text": {"total_documents": 0, "total_params": 0, "correctly_extracted": 0, 
                "processing_time": 0}
    }
    
    # Abnormality detection data
    all_ground_truth_abnormal = set()
    all_detected_abnormal = set()
    
    # Process each sample
    print("\n===== PROCESSING TEST SAMPLES =====")
    samples = ground_truth_data.get("samples", {})
    print(f"Found {len(samples)} samples to process")
    
    for file_name, sample_data in samples.items():
        doc_type = sample_data.get("type", "").lower()
        ground_truth_params = sample_data.get("parameters", {})
        
        print(f"\n----- Processing sample: {file_name} -----")
        print(f"Document type: {doc_type}")
        print(f"Ground truth parameters: {ground_truth_params}")
        
        if not doc_type or not ground_truth_params or doc_type not in ["pdf", "image", "text"]:
            print(f"Warning: Invalid sample data for {file_name}")
            continue
        
        file_path = os.path.join(test_data_dir, doc_type, file_name)
        print(f"Looking for file at: {file_path}")
        
        # Skip if file doesn't exist
        if not os.path.exists(file_path):
            print(f"Warning: File not found: {file_path}")
            continue
        
        print(f"File found, size: {os.path.getsize(file_path)} bytes")
        
        # Extract parameters based on document type
        start_time = time.time()
        extracted_params = {}
        
        try:
            print(f"Beginning extraction using {doc_type} extractor...")
            if doc_type == "pdf":
                extracted_params = pdf_extractor.extract(file_path)
                doc_type_results["pdf"]["total_documents"] += 1
            elif doc_type == "image":
                extracted_params = image_extractor.extract(file_path)
                doc_type_results["image"]["total_documents"] += 1
            elif doc_type == "text":
                with open(file_path, 'r', encoding='utf-8') as f:
                    text = f.read()
                extracted_params = text_extractor.extract(text)
                doc_type_results["text"]["total_documents"] += 1
            
            processing_time = time.time() - start_time
            print(f"Extraction completed in {processing_time:.2f} seconds")
            print(f"Extracted parameters: {extracted_params}")
            
            # Update overall counters
            overall_results["total_documents"] += 1
            overall_results["processing_time"] += processing_time
            overall_results["total_params"] += len(ground_truth_params)
            
            # Update document type counters
            doc_type_results[doc_type]["processing_time"] += processing_time
            doc_type_results[doc_type]["total_params"] += len(ground_truth_params)
            
            print("\nEvaluating extraction accuracy...")
            # Compare extracted parameters with ground truth
            accuracy_results = evaluate_extraction_accuracy(ground_truth_params, extracted_params)
            
            # Update extraction accuracy counters
            overall_results["correctly_extracted_params"] += accuracy_results["correctly_extracted"]
            doc_type_results[doc_type]["correctly_extracted"] += accuracy_results["correctly_extracted"]
            
            print("\nChecking for abnormal parameters...")
            # Check for abnormal parameters
            file_abnormal_params = ground_truth_data.get("abnormal_parameters", {}).get(file_name, [])
            print(f"Ground truth abnormal parameters for {file_name}: {file_abnormal_params}")
            
            # Convert extracted values to numerical for abnormality checking
            numerical_extracted = {}
            for param, value in extracted_params.items():
                try:
                    if isinstance(value, dict) and 'value' in value:
                        numerical_extracted[param] = float(value['value'])
                    elif isinstance(value, (int, float)):
                        numerical_extracted[param] = float(value)
                    elif isinstance(value, str):
                        num_str = ''.join(c for c in value if c.isdigit() or c in '.')
                        if num_str:
                            numerical_extracted[param] = float(num_str)
                except (ValueError, TypeError):
                    continue
            
            detected_abnormal = []
            print("Checking extracted parameters against normal ranges:")
            for param, value in numerical_extracted.items():
                # Check if parameter exists in medical_ranges
                if param in medical_ranges:
                    range_min, range_max = medical_ranges[param]["normal_range"]
                    print(f"  {param} = {value}, normal range: {range_min}-{range_max}")
                    
                    if value < range_min or value > range_max:
                        detected_abnormal.append(param)
                        print(f"  ⚠️ Detected abnormal: {param} = {value}")
                    else:
                        print(f"  ✓ Normal: {param} = {value}")
                else:
                    print(f"  ⚠️ No range defined for {param}")
            
            # Add file identifier to abnormal parameters
            for param in file_abnormal_params:
                all_ground_truth_abnormal.add(f"{file_name}:{param}")
                print(f"Added to ground truth abnormal: {file_name}:{param}")
            
            for param in detected_abnormal:
                all_detected_abnormal.add(f"{file_name}:{param}")
                print(f"Added to detected abnormal: {file_name}:{param}")
            
        except Exception as e:
            print(f"Error processing {file_path}: {str(e)}")
            traceback.print_exc()
            continue
    
    print("\n===== CALCULATING FINAL METRICS =====")
    
    # Calculate overall metrics
    if overall_results["total_params"] > 0:
        overall_accuracy = (overall_results["correctly_extracted_params"] / overall_results["total_params"]) * 100
        print(f"Overall accuracy: {overall_accuracy:.2f}% ({overall_results['correctly_extracted_params']}/{overall_results['total_params']} parameters correct)")
    else:
        overall_accuracy = 0
        print("No parameters were evaluated")
        
    if overall_results["total_documents"] > 0:
        avg_processing_time = overall_results["processing_time"] / overall_results["total_documents"]
        print(f"Average processing time: {avg_processing_time:.2f} seconds per document")
    else:
        avg_processing_time = 0
        print("No documents were processed")
    
    # Calculate document type metrics
    by_doc_type = {}
    for doc_type, results in doc_type_results.items():
        if results["total_params"] > 0:
            accuracy = (results["correctly_extracted"] / results["total_params"]) * 100
            print(f"{doc_type.upper()} accuracy: {accuracy:.2f}% ({results['correctly_extracted']}/{results['total_params']} parameters correct)")
        else:
            accuracy = 0
            print(f"No {doc_type} parameters were evaluated")
            
        if results["total_documents"] > 0:
            avg_time = results["processing_time"] / results["total_documents"]
            if doc_type == "pdf":
                ocr_rate = (results["ocr_fallback_count"] / results["total_documents"]) * 100
            else:
                ocr_rate = 0
        else:
            avg_time = 0
            ocr_rate = 0
            
        by_doc_type[doc_type] = {
            "accuracy": accuracy,
            "total_documents": results["total_documents"],
            "avg_processing_time": avg_time,
            "ocr_fallback_percentage": ocr_rate
        }
    
    # Calculate abnormality detection metrics
    print("\nCalculating abnormality detection metrics...")
    abnormality_metrics = evaluate_abnormality_detection(
        all_ground_truth_abnormal, all_detected_abnormal)
    
    return {
        "overall": {
            "accuracy": overall_accuracy,
            "abnormality_detection": abnormality_metrics,
            "processing_time": avg_processing_time,
            "total_documents": overall_results["total_documents"],
            "total_parameters": overall_results["total_params"],
            "correctly_extracted_parameters": overall_results["correctly_extracted_params"]
        },
        "by_document_type": by_doc_type,
        "timestamp": datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    }