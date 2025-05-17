import subprocess
import re
from src.extraction.medical_ranges import medical_ranges, is_abnormal, get_normal_range, get_unit

class LLMInterface:
    def __init__(self, model_name="phi3"):
        self.model_name = model_name
        self._check_ollama()
    
    def _check_ollama(self):
        """Check if Ollama is installed and the model is available"""
        try:
            result = subprocess.run(["ollama", "list"], check=True, capture_output=True, text=True)
            if self.model_name not in result.stdout:
                print(f"Warning: Model '{self.model_name}' not found in Ollama.")
                print(f"You may need to run: ollama pull {self.model_name}")
        except FileNotFoundError:
            print("Warning: Ollama not found. Please install Ollama: https://ollama.ai/download")
        except Exception as e:
            print(f"Error checking Ollama: {e}")
    
    def get_answer(self, question, parameters=None):
        """
        Get an answer to a medical question based on extracted parameters
        
        Args:
            question (str): The question to answer
            parameters (dict): Dictionary of extracted parameters
            
        Returns:
            str: Answer to the question
        """
        # Try rule-based answering first
        rule_based_answer = self._rule_based_answer(question, parameters)
        if rule_based_answer:
            return rule_based_answer
        
        # Fall back to LLM
        return self._query_llm(question, parameters)
    
    def _rule_based_answer(self, question, parameters):
        """Try to answer simple questions using rules"""
        if not parameters:
            return None
        
        # Check for "is my X normal" questions
        normal_pattern = re.compile(r"is my ([a-zA-Z\s]+) (normal|ok)", re.IGNORECASE)
        match = normal_pattern.search(question)
        
        if match:
            param_query = match.group(1).lower().strip()
            
            # Find closest matching parameter
            matched_param = None
            for param in parameters:
                if param.lower() in param_query or param_query in param.lower():
                    matched_param = param
                    break
            
            if matched_param and "value" in parameters[matched_param]:
                value = parameters[matched_param]["value"]
                unit = parameters[matched_param].get("unit") or get_unit(matched_param)
                
                abnormal = is_abnormal(matched_param, value)
                if abnormal is not None:
                    status = "abnormal" if abnormal else "normal"
                    range_info = get_normal_range(matched_param)
                    
                    response = f"Your {matched_param} is {value} {unit}, which is {status}. "
                    if range_info:
                        response += f"The normal range is {range_info[0]}-{range_info[1]} {unit}."
                    
                    return response
        
        return None
    
    def _query_llm(self, question, parameters):
        """Query the LLM for an answer"""
        try:
            # Build prompt with context from parameters
            prompt = "You are a helpful medical assistant. "
            
            if parameters:
                prompt += "Here are the medical test results:\n\n"
                for param, data in parameters.items():
                    if "value" in data:
                        value = data["value"]
                        unit = data.get("unit") or get_unit(param) or ""
                        prompt += f"- {param}: {value} {unit}\n"
                
                prompt += "\n"
            
            prompt += f"Question: {question}\n\nAnswer:"
            
            # Call Ollama
            result = subprocess.run(
                ["ollama", "run", self.model_name, prompt],
                capture_output=True,
                text=True,
                timeout=30
            )
            
            return result.stdout.strip()
        except Exception as e:
            print(f"Error querying LLM: {e}")
            return "I'm sorry, I couldn't process your question. Please make sure Ollama is installed and running."