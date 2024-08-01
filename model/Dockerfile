# Description: Dockerfile for PyTorch with GPU support
# Author: Kangwei Liao
# Date: 2024-3-21

# docker build command:
# docker build -f Dockerfile -t local/pytorch .

# docker container run command:
# docker run --gpus all -v "$(pwd):/app" --rm -it local/pytorch

FROM nvidia/cuda:11.8.0-base-ubuntu22.04

# Avoid prompts from apt
ENV DEBIAN_FRONTEND=noninteractive

# Update and install software-properties-common to add repositories
RUN apt-get update && apt-get install -y --no-install-recommends \
    software-properties-common \
    && add-apt-repository ppa:deadsnakes/ppa

# Install Python (specify your desired Python version, e.g., python3.8)
RUN apt-get update && apt-get install -y --no-install-recommends \
    python3.11 \
    python3-pip \
    && python3.11 -m pip install --upgrade pip \
    && ln -s /usr/bin/python3.11 /usr/local/bin/python3 \
    && ln -s /usr/bin/python3.11 /usr/local/bin/python

# Clean up
RUN apt-get clean && rm -rf /var/lib/apt/lists/*

# install pytorch
RUN pip install torch torchvision torchaudio --index-url https://download.pytorch.org/whl/cu118

# Install the Python dependencies from requirements.txt
RUN pip install --no-cache-dir -r requirements.txt

# Set the working directory in the container
WORKDIR /app

# Test PyTorch GPU support
#CMD ["python3", "-c", "import torch; print(torch.cuda.is_available())"]
