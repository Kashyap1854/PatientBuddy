"""
Script to run evaluations on the Patient Buddy system.
"""
import os
import sys
import json
import argparse
import traceback
from datetime import datetime

# Make sure the src module is in the path
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "../..")))

try:
    from src.evaluation.metrics import run_evaluation
except ImportError as e:
    print(f"Error importing evaluation metrics: {str(e)}")
    traceback.print_exc()
    sys.exit(1)

def main():
    """Run the evaluation process and print results."""
    parser = argparse.ArgumentParser(description='Evaluate Patient Buddy extraction accuracy')
    parser.add_argument('--test-data', type=str, default='data/test',
                        help='Directory containing test data')
    parser.add_argument('--output', type=str, default='results/evaluation_results.json',
                        help='Output file for evaluation results')
    args = parser.parse_args()
    
    print(f"Starting evaluation at {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    print(f"Test data directory: {os.path.abspath(args.test_data)}")
    
    # Check if test directory exists
    if not os.path.exists(args.test_data):
        print(f"Error: Test data directory not found: {args.test_data}")
        sys.exit(1)
        
    # Check if ground truth file exists
    if not os.path.exists(os.path.join(args.test_data, "ground_truth.json")):
        print(f"Error: ground_truth.json not found in {args.test_data}")
        sys.exit(1)
    
    # Make sure output directory exists
    try:
        os.makedirs(os.path.dirname(args.output), exist_ok=True)
    except Exception as e:
        print(f"Error creating output directory: {str(e)}")
        traceback.print_exc()
        sys.exit(1)
    
    # Run evaluation
    print(f"Running evaluation on test data in {args.test_data}...")
    try:
        results = run_evaluation(args.test_data)
    except Exception as e:
        print(f"Error during evaluation: {str(e)}")
        traceback.print_exc()
        sys.exit(1)
    
    # Save results
    try:
        with open(args.output, 'w') as f:
            json.dump(results, f, indent=2)
        print(f"Results saved to {os.path.abspath(args.output)}")
    except Exception as e:
        print(f"Error saving results: {str(e)}")
        traceback.print_exc()
    
    # Print summary with safe key access
    print("\n" + "="*50)
    print("EVALUATION RESULTS SUMMARY")
    print("="*50)
    print(f"Overall Accuracy: {results.get('overall', {}).get('accuracy', 0):.2f}%")
    
    # Safely access nested keys
    overall = results.get('overall', {})
    print(f"Total Parameters: {overall.get('total_parameters', 0)}")
    print(f"Correctly Extracted: {overall.get('correctly_extracted_parameters', 0)}")
    
    abnormality = overall.get('abnormality_detection', {})
    print(f"Abnormality Detection F1: {abnormality.get('f1_score', 0):.2f}%")
    print(f"Average Processing Time: {overall.get('processing_time', 0):.2f}s")
    
    print("\nPerformance by Document Type:")
    for doc_type, metrics in results.get('by_document_type', {}).items():
        if metrics and metrics.get("total_documents", 0) > 0:
            print(f"- {doc_type.upper()}: {metrics.get('accuracy', 0):.2f}% accuracy, ")
                  
    
    print(f"\nFull results saved to {args.output}")

if __name__ == "__main__":
    main()