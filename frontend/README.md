# Chatmate

- The chatbot on this platform is powered by vLLM (Vast Language Model), an open-source library designed to host and deploy large language models. Below, we provide detailed instructions on how to install and deploy vLLM using Docker.

## Deploying vLLM with Docker

To deploy **vLLM** using Docker, follow these steps:

1.  Ensure you have Docker installed on your machine. If not, you can download it [here](https://www.docker.com/).
2.  **vLLM** offers official docker image for deployment. The image can be used to run OpenAI compatible server. The image is available on Docker Hub as vllm/vllm-openai.
    ```bash
    docker run --runtime nvidia --gpus all \
    -v ~/.cache/huggingface:/root/.cache/huggingface \
    --env "HUGGING_FACE_HUB_TOKEN=<secret>" \
    -p 8000:8000 \
    --ipc=host \
    vllm/vllm-openai:latest \
    --model mistralai/Mistral-7B-v0.1
    ```
3. **vLLM** should now be running and accessible at `http://localhost:8000`.

### Start Chatbot UI

To get started with the Generative AI Learning Platform, follow these steps:

1. Clone this repository to your local machine.
2. Install the required dependencies by running `npm install`.
3. Create a `.env` file in root directory.
4. Define environment variables
    ```bash
    NEXT_PUBLIC_API_URL=your-server-ip-address-here:port-number
    NEXT_PUBLIC_MODEL_NAME=hosted-model-name-in-as-in-huggingface
    NEXT_PUBLIC_START_URL=your-server-proxy-ip-address-here:port-number
    NEXT_HF_TOKEN=your-huggingface-access-token
    ```
5. Start the application with `npm run dev`.
6. Access the platform in your web browser at `http://localhost:3000`.

