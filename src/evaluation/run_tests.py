"""
Script to run evaluations on the Patient Buddy system.
"""
import os
import json
import argparse
from datetime import datetime

from src.evaluation.metrics import (
    evaluate_extraction_accuracy,
    evaluate_abnormality_detection,
    analyze_performance_by_document_type,
    run_evaluation
)

def main():
    parser = argparse.ArgumentParser(description='Evaluate Patient Buddy extraction accuracy')
    parser.add_argument('--test-data', type=str, default='data/test',
                        help='Directory containing test data')
    parser.add_argument('--output', type=str, default='results/evaluation_results.json',
                        help='Output file for evaluation results')
    args = parser.parse_args()
    
    # Make sure output directory exists
    os.makedirs(os.path.dirname(args.output), exist_ok=True)
    
    # Run evaluation
    print(f"Running evaluation on test data in {args.test_data}...")
    results = run_evaluation(args.test_data)
    
    # Save results
    with open(args.output, 'w') as f:
        json.dump(results, f, indent=2)
    
    # Print summary
    print("\n" + "="*50)
    print("EVALUATION RESULTS SUMMARY")
    print("="*50)
    print(f"Overall Accuracy: {results['overall']['accuracy']:.2f}%")
    print(f"Abnormality Detection F1: {results['overall']['abnormality_detection'].get('f1_score', 0):.2f}%")
    print(f"Average Processing Time: {results['overall']['processing_time']:.2f}s")
    print("\nPerformance by Document Type:")
    for doc_type, metrics in results['by_document_type'].items():
        if metrics:
            print(f"- {doc_type.upper()}: {metrics.get('accuracy', 0):.2f}% accuracy")
    
    print(f"\nFull results saved to {args.output}")

if __name__ == "__main__":
    main()