import subprocess
import datetime

def log_error(message):
    with open("llm_errors.log", "a", encoding="utf-8") as log_file:
        log_file.write(f"{datetime.datetime.now()} - {message}\n")

def run_phi3(prompt):
    try:
        result = subprocess.run(
            ["ollama", "run", "phi3", prompt],
            capture_output=True,
            text=True,
            encoding="utf-8",
            errors="replace",
            timeout=60
        )
        if result.returncode == 0:
            return result.stdout
        else:
            log_error(f"Return code: {result.returncode}, Stderr: {result.stderr}")
            return f"Error: {result.stderr}"
    except subprocess.TimeoutExpired as e:
        log_error(f"TimeoutExpired: {str(e)}")
        return "Error: Ollama timed out. Try increasing the timeout or check system resources."
    except Exception as e:
        log_error(f"Exception: {str(e)}")
        return f"Error: {str(e)}"