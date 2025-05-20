"""
Evaluation metrics for measuring the performance of the Patient Buddy system.
"""
import os
import json
import time
from collections import defaultdict
from typing import Dict, Set, List, Tuple, Any

# Import your project's modules
from src.extraction.medical_ranges import medical_ranges, is_abnormal


def evaluate_extraction_accuracy(ground_truth: Dict[str, float], extracted_params: Dict[str, float]) -> Dict[str, Any]:
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
    
    for param, true_value in ground_truth.items():
        if param in extracted_params:
            extracted_value = extracted_params[param]
            # Check if value is within acceptable margin of error (1%)
            if abs(extracted_value - true_value) <= (true_value * 0.01):
                correctly_extracted += 1
            else:
                value_errors += 1
                
    accuracy = correctly_extracted / total_params if total_params > 0 else 0
    
    return {
        "accuracy": accuracy * 100,
        "total_parameters": total_params,
        "correctly_extracted": correctly_extracted,
        "value_errors": value_errors,
        "missed_parameters": total_params - len(extracted_params)
    }


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
    
    return {
        "precision": precision * 100,
        "recall": recall * 100,
        "f1_score": f1 * 100,
        "true_positives": tp,
        "false_positives": fp,
        "false_negatives": fn
    }


def analyze_performance_by_document_type(test_results: Dict[str, Dict]) -> Dict[str, Dict]:
    
    """
    Analyzes extraction performance across different document types.
    
    Args:
        test_results: Results organized by document type
        
    Returns:
        Performance metrics by document type
    """
    performance_by_type = {}
    
    for doc_type, results in test_results.items():
        performance_by_type[doc_type] = {
            "accuracy": results["accuracy"],
            "sample_size": results["total_documents"],
            "avg_extraction_time": results["avg_processing_time"],
            "ocr_fallback_rate": results.get("ocr_fallback_percentage", 0)
        }
    
    return performance_by_type


def run_evaluation(test_data_dir: str) -> Dict[str, Any]:
    """
    Run a comprehensive evaluation on test data and return all metrics.
    
    Args:
        test_data_dir: Directory containing test data and ground truth annotations
        
    Returns:
        Complete evaluation results
    """
    # Load test data and ground truth
    with open(os.path.join(test_data_dir, "ground_truth.json"), "r") as f:
        ground_truth_data = json.load(f)
    
    # Results container
    results = {
        "overall": {
            "accuracy": 0,
            "abnormality_detection": {},
            "processing_time": 0
        },
        "by_document_type": {
            "pdf": {},
            "image": {},
            "text": {}
        },
        "by_parameter": defaultdict(dict)
    }
    
    # TODO: Implement the actual evaluation logic using your extraction system
    # This would involve:
    # 1. Processing each test document
    # 2. Comparing extracted parameters with ground truth
    # 3. Calculating metrics using the above functions
    
    return results