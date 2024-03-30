import os

from dotenv import find_dotenv, load_dotenv
from langchain.prompts import ChatPromptTemplate
from langchain_community.chat_models import ChatOllama
from langchain_community.vectorstores.chroma import Chroma
from rag_utils.create_embeddings import embeddings_model

load_dotenv(find_dotenv(filename=".env"))

CHROMA_PATH = "chroma"

PROMPT_TEMPLATE = """
Answer the question based only on the following context:
{context}

---

Answer the question based on the above context: {question}
Keep your answer ground in the facts of the context.
If the context doesn't contain the facts to answer the question say that you donot know the answer.
"""

OOC_TEMPLATE = """
Could not find matching results in the given context.

Following response was generated from existing data:
{response}
"""

query_model_name = os.getenv("QUERY_MODEL")

query_model = ChatOllama(model=query_model_name)

db = Chroma(persist_directory=CHROMA_PATH, embedding_function=embeddings_model)

def query_data(prompt: str) -> str:

    # Prepare the DB.

    # Search the DB.
    results = db.similarity_search_with_relevance_scores(prompt, k=3)

    if len(results) == 0 or results[0][1] < 0.7:
        print(f"Unable to find matching results.")
        response_text = invoke_model(prompt)
        print(response_text)
        response = f"""
            Could not find matching results in the given context.\nFollowing response was generated from existing data:\n\n{response_text}
        """
        return response

    context_text = "\n\n---\n\n".join([doc.page_content for doc, _score in results])
    prompt_template = ChatPromptTemplate.from_template(PROMPT_TEMPLATE)
    prompt = prompt_template.format(context=context_text, question=prompt)

    response_text = invoke_model(prompt)

    sources = set([doc.metadata.get("file_name", None) for doc, _score in results])
    source_str = ""
    for source in sources:
        source_str += source
        source_str += "\n"
    formatted_response = f"{response_text}\n\nSources:\n {source_str}"
    return formatted_response

def invoke_model(prompt: str) -> str:
    try:
        response_text = query_model.invoke(prompt).content
        return response_text
    except Exception as e:
        print(f"Error trying to invoke model: {e}")
        return ""