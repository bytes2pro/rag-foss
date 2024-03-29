import os
import shutil
from pprint import pprint
from typing import List, Tuple

from dotenv import find_dotenv, load_dotenv
from langchain.schema import Document
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain_community.document_loaders import (CSVLoader,
                                                  UnstructuredFileLoader)
from langchain_community.embeddings import HuggingFaceEmbeddings
from langchain_community.vectorstores.chroma import Chroma
from rag_utils.json_loader import JSONLoader

load_dotenv(find_dotenv(filename=".env"))


CHROMA_PATH = "chroma"

embeddings_model_name = os.getenv("EMBEDDINGS_MODEL")
embeddings_model = HuggingFaceEmbeddings(
    model_name=embeddings_model_name,
    model_kwargs={'device': 'cpu'},
    encode_kwargs={'normalize_embeddings': False}
)

try:
    if os.path.exists(CHROMA_PATH):
        shutil.rmtree(CHROMA_PATH)
except Exception as e:
    print(f"Error removing ChromaDB: {e}")


def generate_data_store(directory_path: str) -> None:
    documents = load_documents(directory_path)
    chunks = split_text(documents)
    save_to_chroma(chunks)


def load_documents(directory_path: str) -> Tuple[List[Document], List[str]]:
    print(f"Loading docs from {directory_path}.")
    documents, num_docs = [], 0
    for filename in os.listdir(directory_path):
        try:
            print(f"Trying to load {filename}")
            loader, file_path = None, os.path.join(directory_path, filename)
            if filename.endswith(".json"):
                loader = JSONLoader(file_path=file_path)
            elif filename.endswith(".csv"):
                loader = CSVLoader(
                    file_path=file_path,
                    csv_args = {
                        "delimiter": ',',
                        "skipinitialspace": True,
                        #"quotechar": csv.Dialect.quotechar,
                    }
                )
            else:
                loader = UnstructuredFileLoader(file_path)
            document = loader.load()
            print(f"Loaded {filename} as {len(document)} document(s).")
            documents.extend(document)
            num_docs += 1
        except Exception as e:
            print(e)
            continue
    print(f"Loaded {num_docs} out of {len(os.listdir(directory_path))}")
    return documents


def split_text(documents: list[Document]) -> List[Document]:
    try:
        print(f"Splitting texts.")
        text_splitter = RecursiveCharacterTextSplitter(
            chunk_size=300,
            chunk_overlap=100,
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
