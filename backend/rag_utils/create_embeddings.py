import os
from typing import List

from autollm.utils.markdown_reader import MarkdownReader
from autollm.utils.pdf_reader import LangchainPDFReader
from dotenv import find_dotenv, load_dotenv
from langchain.schema import Document
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain_community.embeddings import HuggingFaceEmbeddings
from langchain_community.vectorstores.chroma import Chroma
from llama_index.readers.file.base import SimpleDirectoryReader
from utils.utils import get_mime_type

load_dotenv(find_dotenv(filename=".env"))

file_extractor = {
	".md": MarkdownReader(read_as_single_doc=True),
	".pdf": LangchainPDFReader(extract_images=False)
}

CHROMA_PATH = "chroma"

embeddings_model_name = os.getenv("EMBEDDINGS_MODEL")
embeddings_model = HuggingFaceEmbeddings(
	model_name=embeddings_model_name,
	model_kwargs={'device': 'cpu'},
	encode_kwargs={'normalize_embeddings': False}
)

try:
	if not os.path.exists(CHROMA_PATH):
		os.mkdir(CHROMA_PATH)
except Exception as e:
	print(f"Error removing ChromaDB: {e}")


def generate_data_store(directory_path: str) -> None:
	documents = load_documents(directory_path)
	chunks = split_text(documents)
	save_to_chroma(chunks)


def load_documents(directory_path: str) -> List[Document]:
	print(f"Loading docs from {directory_path}.")
	try:
		loader = SimpleDirectoryReader(
					input_dir=directory_path, 
					file_extractor=file_extractor, 
					filename_as_id=True, 
					recursive=True
				)
		documents = loader.load_data(show_progress=True)
		print(f"Loaded {len(documents)} out of {len(os.listdir(directory_path))}")
		for i in range(len(documents)):
			documents[i].metadata['file_type'] = get_mime_type(documents[i].metadata['file_name'])
			documents[i] = Document(metadata=documents[i].metadata, page_content=documents[i].text, type= 'Document')
		return documents
	except Exception as e:
		print(e)
		return []

def split_text(documents: list[Document]) -> List[Document]:
	try:
		print(f"Splitting texts.")
		text_splitter = RecursiveCharacterTextSplitter(
			chunk_size=500,
			chunk_overlap=200,
			length_function=len,
			add_start_index=True,
		)
		chunks = text_splitter.split_documents(documents)
		print(f"Split {len(documents)} documents into {len(chunks)} chunks.")
		return chunks
	except Exception as e:
		print(f"Error splitting texts: {e}")
		return []


def save_to_chroma(chunks: list[Document]) -> None:
	print("Saving to ChromaDB.")
	if len(chunks) == 0:
		print("No documents extracted")
		return
	# Create a new DB from the documents.
	db = Chroma.from_documents(
		documents=chunks, embedding=embeddings_model, persist_directory=CHROMA_PATH
	)
	db.persist()
	print(f"Saved {len(chunks)} chunks to {CHROMA_PATH}.")
