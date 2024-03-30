import os
import shutil
import uuid
from typing import List

import uvicorn
from dotenv import find_dotenv, load_dotenv
from fastapi import FastAPI, File, Request, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from rag_utils.create_embeddings import generate_data_store
from rag_utils.query_data import query_data
from utils.utils import sanitize_string

load_dotenv(find_dotenv(filename=".env"))

DOWNLOAD_DIR = "downloads"

if os.path.exists(DOWNLOAD_DIR):
	shutil.rmtree(DOWNLOAD_DIR)
os.mkdir(DOWNLOAD_DIR)

app = FastAPI()

# Add CORS middleware to allow all origins
app.add_middleware(
	CORSMiddleware,
	allow_origins=["*"],  # Adjust this to your specific needs
	allow_credentials=True,
	allow_methods=["*"],
	allow_headers=["*"],
)

accepted_extensions = [
    ".md", 
    ".pdf", 
    ".docx", 
    ".doc", 
    ".xlsx", 
    ".xls", 
    ".txt", 
    ".csv", 
    ".json", 
    ".epub"
]

@app.post("/ingest")
async def ingest_files(
	files: List[UploadFile] = File(...),
):
	try:
		file_path = f"{DOWNLOAD_DIR}/{str(uuid.uuid4())}"
		if os.path.exists(file_path):
			shutil.rmtree(file_path)
		os.mkdir(file_path)
		for file in files:
			file_name, file_ext = os.path.splitext(file.filename)
			file_name = f"{sanitize_string(file_name)}{file_ext}"
			print(file_name)
			if file_ext not in accepted_extensions:
				continue
			contents = await file.read()
			with open(os.path.join(file_path, file_name), "wb") as f:
				f.write(contents)
		generate_data_store(file_path)
		return {"status": 200}
	except Exception as e:
		print(e)
		return {"status": 501, "error": str(e)}


@app.post("/chat")
def chat_completion(query: dict):
	try:
		prompt = query["prompt"]
		response = query_data(prompt)
		return {"status": 200, "response": response}
	except Exception as e:
		print(f"Error in chat: {e}")
		return {"status": 501, "error": str(e)}


@app.get("/")
def base_check(request: Request) -> str:
	referer = request.headers.get('referer')
	return f"i am works for {referer}"


if __name__ == "__main__":
	uvicorn.run("app:app", host="0.0.0.0", port=8001, reload=True)
