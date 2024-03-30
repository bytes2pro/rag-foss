import mimetypes
import os
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

def get_mime_type(filename) -> str:
    _, file_extension = os.path.splitext(filename)
    file_extension = file_extension.lower()

    extension_mimetypes = {
        ".md": "text/markdown",
        ".pdf": "application/pdf",
        ".docx": "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        ".doc": "application/msword",
        ".xlsx": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        ".xls": "application/vnd.ms-excel",
        ".txt": "text/plain",
        ".csv": "text/csv",
        ".json": "application/json",
        ".epub": "application/epub+zip"
    }

    mime_type = extension_mimetypes.get(file_extension, mimetypes.guess_type(filename)[0])
    if not mime_type:
        return "application/octet-stream"
    return mime_type