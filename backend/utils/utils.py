import re


# Function to sanitize the collection name
def sanitize_string(name):
    # Remove special characters and spaces
    sanitized_name = re.sub(r"[^a-zA-Z0-9]", "", name)
    return sanitized_name

def is_image_filename(filename):
    # Regular expression pattern to match common image file extensions
    image_extensions_pattern = r'\.(jpg|jpeg|png|gif|bmp|svg|tiff)$'
    
    # Case-insensitive matching
    return re.search(image_extensions_pattern, filename, re.IGNORECASE) is not None