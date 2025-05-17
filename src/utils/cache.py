def cache_extracted_text(file_path, text):
    with open(file_path, 'w') as cache_file:
        cache_file.write(text)

def load_cached_text(file_path):
    try:
        with open(file_path, 'r') as cache_file:
            return cache_file.read()
    except FileNotFoundError:
        return None

def clear_cache(file_path):
    try:
        os.remove(file_path)
    except FileNotFoundError:
        pass