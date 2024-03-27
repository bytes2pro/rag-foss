import os
import shutil
import uuid
from typing import List

import uvicorn
from autollm import AutoQueryEngine, read_files_as_documents
from dotenv import find_dotenv, load_dotenv
from fastapi import FastAPI, File, Request, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from utils.utils import sanitize_string

load_dotenv(find_dotenv(filename=".env"))

if os.path.exists(".lancedb"):
    shutil.rmtree(".lancedb")
os.mkdir(".lancedb")


app = FastAPI()


os.environ["OPENAI_API_KEY"] = os.getenv("OPENAI_API_KEY")

query_engine = AutoQueryEngine.from_defaults(
    enable_cost_calculator=True,
    llm_temperature=0.5,
    chunk_size=512,
    chunk_overlap=64,
    context_window=4096,
    similarity_top_k=3,
    structured_answer_filtering=False,
    vector_store_type="LanceDBVectorStore",
    lancedb_table_name="vectors",
    exist_ok=True,
    use_async=False,
    overwrite_existing=False,
)

# Add CORS middleware to allow all origins
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Adjust this to your specific needs
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/ingest")
async def ingest_files(
    files: List[UploadFile] = File(...),
):
    try:
        file_path = f"uploads/{str(uuid.uuid4())}"
        if os.path.exists(file_path):
            shutil.rmtree(file_path)
        os.mkdir(file_path)
        for file in files:
            file_name, file_ext = os.path.splitext(file.filename)
            file_name = f"{sanitize_string(file_name)}{file_ext}"
            print(file_name)
            contents = await file.read()
            with open(os.path.join(file_path, file_name), "wb") as f:
                f.write(contents)
        documents = read_files_as_documents(input_dir=file_path)
        AutoQueryEngine.from_defaults(
            enable_cost_calculator=True,
            documents=documents,
            chunk_size=1024,
            chunk_overlap=200,
            context_window=4096,
            similarity_top_k=3,
            structured_answer_filtering=False,
            vector_store_type="LanceDBVectorStore",
            lancedb_table_name="vectors",
            use_async=False,
            exist_ok=True,
            overwrite_existing=False,
        )
        return {"status": 200}
    except Exception as e:
        print(e)
        return {"status": 501, "error": str(e)}


@app.post("/chat")
def chat_completion(query: dict):
    try:
        prompt = query["prompt"]
        response = query_engine.query(prompt)
        return {"status": 200, "response": response.response}
    except Exception as e:
        print(e)
        return {"status": 501, "error": str(e)}


@app.get("/")
def base_check(request: Request) -> str:
    referer = request.headers.get('referer')
    return f"i am works for {referer}"


if __name__ == "__main__":
    uvicorn.run("app:app", host="0.0.0.0", port=8001, reload=True)
