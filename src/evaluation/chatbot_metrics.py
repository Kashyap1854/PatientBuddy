"""
Evaluation metrics for the Patient Buddy chatbot component.
"""
import json
import time
import numpy as np
import os
from datetime import datetime
from typing import Dict, List, Any, Tuple

# Import your LLM interface
from src.models.llm_interface import LLMInterface

def evaluate_chatbot(test_conversations: List[Dict], model_name: str) -> Dict[str, Any]:
    """
    Evaluate chatbot performance on test conversations.
    
    Args:
        test_conversations: List of test conversations with expected responses
        model_name: Name of the model being evaluated
        
    Returns:
        Dictionary of evaluation metrics
    """
    results = {
        "total_queries": 0,
        "correct_responses": 0,
        "response_times": [],
        "context_retention_score": 0,
        "unknown_query_handling": 0,
        "medical_accuracy": 0,
        "errors": 0,
    }
    
    context_retention_tests = 0
    medical_accuracy_tests = 0
    unknown_query_tests = 0
    
    # Initialize LLM interface
    print(f"Initializing LLM interface with model: {model_name}")
    llm = LLMInterface(model_name=model_name)
    
    for conv in test_conversations:
        print(f"\nProcessing conversation: {conv.get('id', 'unknown')} - {conv.get('description', '')}")
        results["total_queries"] += len(conv["turns"])
        
        # Extract test parameters, if any
        test_parameters = conv.get("parameters", {})
        
        for i, turn in enumerate(conv["turns"]):
            query = turn["query"]
            expected = turn["expected_response"]
            
            print(f"Turn {i+1}: Query: '{query}'")
            print(f"Expected: '{expected}'")
            
            # Track if this tests context retention
            tests_context = turn.get("tests_context", False)
            if tests_context:
                context_retention_tests += 1
                
            # Track if this tests medical accuracy
            tests_medical = turn.get("tests_medical", False)
            if tests_medical:
                medical_accuracy_tests += 1
                
            # Track if this tests unknown query handling
            tests_unknown = turn.get("tests_unknown", False)
            if tests_unknown:
                unknown_query_tests += 1
            
            # Get response from chatbot
            try:
                start_time = time.time()
                # Use your LLM interface to get the answer
                response = llm.get_answer(query, test_parameters)
                end_time = time.time()
                
                print(f"Response: '{response}'")
                
                # Record response time
                response_time = end_time - start_time
                results["response_times"].append(response_time)
                print(f"Response time: {response_time:.2f}s")
                
                # Check correctness (simplified)
                similarity = text_similarity(response, expected)
                print(f"Similarity score: {similarity:.2f}")
                
                if similarity > 0.2:  # Threshold for "correct" response
                    results["correct_responses"] += 1
                    print("✓ Response considered correct")
                    
                    # Update specific test scores
                    if tests_context:
                        results["context_retention_score"] += 1
                    if tests_medical:
                        results["medical_accuracy"] += 1
                    if tests_unknown:
                        results["unknown_query_handling"] += 1
                else:
                    print("✗ Response considered incorrect")
                        
            except Exception as e:
                results["errors"] += 1
                print(f"Error processing query '{query}': {str(e)}")
    
    # Calculate overall metrics
    if results["total_queries"] > 0:
        results["accuracy"] = (results["correct_responses"] / results["total_queries"]) * 100
    else:
        results["accuracy"] = 0
        
    if context_retention_tests > 0:
        results["context_retention_score"] = (results["context_retention_score"] / context_retention_tests) * 100
    else:
        results["context_retention_score"] = 0
        
    if medical_accuracy_tests > 0:
        results["medical_accuracy"] = (results["medical_accuracy"] / medical_accuracy_tests) * 100
    else:
        results["medical_accuracy"] = 0
        
    if unknown_query_tests > 0:
        results["unknown_query_handling"] = (results["unknown_query_handling"] / unknown_query_tests) * 100
    else:
        results["unknown_query_handling"] = 0
        
    if results["response_times"]:
        results["avg_response_time"] = sum(results["response_times"]) / len(results["response_times"])
        results["max_response_time"] = max(results["response_times"])
        results["min_response_time"] = min(results["response_times"])
    else:
        results["avg_response_time"] = 0
        results["max_response_time"] = 0
        results["min_response_time"] = 0
    
    results["timestamp"] = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    results["model"] = model_name
    
    return results


def text_similarity(text1: str, text2: str) -> float:
    """
    Calculate text similarity between two strings (simplified version).
    
    Args:
        text1: First text
        text2: Second text
        
    Returns:
        Similarity score from 0 to 1
    """
    # Simple implementation
    text1 = text1.lower()
    text2 = text2.lower()
    
    # Count words in common
    words1 = set(text1.split())
    words2 = set(text2.split())
    
    common_words = words1.intersection(words2)
    
    # Calculate Jaccard similarity
    if len(words1) == 0 and len(words2) == 0:
        return 1.0
    return len(common_words) / (len(words1) + len(words2) - len(common_words))


def run_chatbot_evaluation(test_data_path: str, model_name: str = "tinyllama") -> Dict[str, Any]:
    """
    Run chatbot evaluation using test conversations from file.
    
    Args:
        test_data_path: Path to test data file
        model_name: Name of the model to evaluate
        
    Returns:
        Evaluation metrics
    """
    try:
        print(f"Loading test data from: {test_data_path}")
        # Handle both absolute and relative paths
        if not os.path.isabs(test_data_path):
            # If it's a relative path, make it relative to the project root
            project_root = os.path.abspath(os.path.join(os.path.dirname(__file__), "../.."))
            test_data_path = os.path.join(project_root, test_data_path)
        
        with open(test_data_path, 'r') as f:
            test_data = json.load(f)
        print(f"Loaded {len(test_data.get('conversations', []))} test conversations")
    except Exception as e:
        print(f"Error loading test data: {str(e)}")
        return {
            "error": f"Failed to load test data: {str(e)}",
            "timestamp": datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        }
    
    return evaluate_chatbot(test_data.get('conversations', []), model_name)