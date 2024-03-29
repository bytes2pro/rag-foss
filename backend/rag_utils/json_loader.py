import json
from pathlib import Path
from typing import Any, Callable, Dict, List, Optional, Union

from langchain.docstore.document import Document
from langchain.document_loaders.base import BaseLoader


class JSONLoader(BaseLoader):
    def __init__(
        self,
        file_path: Union[str, Path],
        content_key: Optional[str] = None,
        metadata_func: Optional[Callable[[dict, dict], dict]] = None,
        json_lines: bool = False
    ):
        """
        Initializes the JSONLoader with a file path, an optional content key to extract specific content,
        and an optional metadata function to extract metadata from each record.
        """
        self.file_path = file_path
        self._content_key = content_key
        self._metadata_func = metadata_func
        self._json_lines = json_lines

    def create_documents(self, processed_data) -> List[Document]:
        """
        Creates Document objects from processed data.
        """
        documents = []
        for item in processed_data:
            content = item.get('content', '')  
            metadata = item.get('metadata', {})
            document = Document(page_content=content, metadata=metadata)
            documents.append(document)
        return documents

    def process_item(self, item, prefix="") -> List[str]:
        if isinstance(item, dict):
            result = []
            for key, value in item.items():
                new_prefix = f"{prefix}.{key}" if prefix else key
                result.extend(self.process_item(value, new_prefix))
            return result
        elif isinstance(item, list):
            result = []
            for value in item:
                result.extend(self.process_item(value, prefix))
            return result
        else:
            return [f"{prefix}: {item}"]


    def process_json(self, data) -> list:
        """
        Processes JSON data to prepare for document creation, extracting content based on the content_key
        and applying the metadata function if provided.
        """
        processed_data = []
        if isinstance(data, list):
            for i, item in enumerate(data):
                content = item.get(self._content_key, '') if self._content_key else item
                metadata = {}
                if self._metadata_func and isinstance(item, dict):
                    metadata = self._metadata_func(item, {})
                else:
                    metadata = {"source": str(self.file_path), "seq_num": i}
                processed_data.append({'content': content, 'metadata': metadata})
        elif isinstance(data, dict):
            content = data.get(self._content_key, '') if self._content_key else data
            metadata = {}
            if self._metadata_func:
                metadata = self._metadata_func(item, {})
            else:
                metadata = {"source": str(self.file_path)}
            processed_data.append({'content': json.dumps(content), 'metadata': metadata})
        return processed_data

    def load(self) -> List[Document]:
        """
        Load and return documents from the JSON or JSON Lines file.
        """
        docs = []
        with open(self.file_path, 'r', encoding="utf-8") as file:
            if self._json_lines:
                # Handle JSON Lines
                for line_number, line in enumerate(file, start=1):
                    try:
                        data = json.loads(line)
                        processed_json = self.process_json(data)
                        docs.extend(self.create_documents(processed_json))
                    except json.JSONDecodeError:
                        print(f"Error: Invalid JSON format at line {line_number}.")
            else:
                # Handle regular JSON
                try:
                    data = json.load(file)
                    processed_json = self.process_json(data)
                    docs = self.create_documents(processed_json)
                except json.JSONDecodeError:
                    print("Error: Invalid JSON format in the file.")
        return docs