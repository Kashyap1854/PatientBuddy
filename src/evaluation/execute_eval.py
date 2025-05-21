"""
Simple script to run chatbot evaluation.
"""
import sys
import os

# Add the project root to Python path
sys.path.insert(0, os.path.abspath(os.path.dirname(os.path.dirname(os.path.dirname(__file__)))))

# Import the evaluation function
from evaluation.chatbot_metrics import run_chatbot_evaluation

# Run the evaluation
results = run_chatbot_evaluation("data/test/chatbot_tests.json", "phi3")

# Print summary
print("\n===== CHATBOT EVALUATION RESULTS =====")
print(f"Model: {results.get('model', 'phi3')}")
print(f"Overall Accuracy: {results.get('accuracy', 0):.2f}%")
print(f"Total Queries: {results.get('total_queries', 0)}")
print(f"Correct Responses: {results.get('correct_responses', 0)}")
print(f"Average Response Time: {results.get('avg_response_time', 0):.3f}s")