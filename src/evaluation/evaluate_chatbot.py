"""
Script to run chatbot evaluation tests.
"""
import os
import sys
import json
import argparse
from datetime import datetime

# Make sure the src module is in the path
sys.path.insert(0, r"c:\Users\Rahul\Desktop\Project\Patient_Buddy_Local")

try:
    from src.evaluation.chatbot_metrics import run_chatbot_evaluation
except ImportError as e:
    print(f"Error importing chatbot metrics: {str(e)}")
    sys.exit(1)

def main():
    """Run the chatbot evaluation process."""
    parser = argparse.ArgumentParser(description='Evaluate Patient Buddy chatbot')
    parser.add_argument('--test-data', type=str, default='data/test/chatbot_tests.json',
                        help='Path to test data file')
    parser.add_argument('--model', type=str, default='tinyllama',
                        help='Name of the model to evaluate')
    parser.add_argument('--output', type=str, default='results/chatbot_evaluation.json',
                        help='Output file for evaluation results')
    args = parser.parse_args()
    
    print(f"Starting chatbot evaluation at {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    print(f"Test data path: {os.path.abspath(args.test_data)}")
    
    # Check if test file exists
    if not os.path.exists(args.test_data):
        print(f"Error: Test data file not found: {args.test_data}")
        sys.exit(1)
    
    # Make sure output directory exists
    os.makedirs(os.path.dirname(args.output), exist_ok=True)
    
    # Run evaluation
    print(f"Running chatbot evaluation using model: {args.model}...")
    results = run_chatbot_evaluation(args.test_data, args.model)
    
    # Save results
    with open(args.output, 'w') as f:
        json.dump(results, f, indent=2)
    print(f"Results saved to {os.path.abspath(args.output)}")
    
    # Print summary
    print("\n" + "="*50)
    print("CHATBOT EVALUATION RESULTS")
    print("="*50)
    print(f"Model: {results.get('model', args.model)}")
    print(f"Overall Accuracy: {results.get('accuracy', 0):.2f}%")
    print(f"Total Queries: {results.get('total_queries', 0)}")
    print(f"Correct Responses: {results.get('correct_responses', 0)}")
    print(f"Average Response Time: {results.get('avg_response_time', 0):.3f}s")
    
    print("\nSpecific Metrics:")
    print(f"- Context Retention: {results.get('context_retention_score', 0):.2f}%")
    print(f"- Medical Accuracy: {results.get('medical_accuracy', 0):.2f}%")
    print(f"- Unknown Query Handling: {results.get('unknown_query_handling', 0):.2f}%")
    
    print(f"\nFull results saved to {args.output}")

if __name__ == "__main__":
    main()