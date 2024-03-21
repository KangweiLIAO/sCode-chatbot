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
    python3.11-venv \
    && python3.11 -m pip install --upgrade pip \
    && ln -s /usr/bin/python3.11 /usr/local/bin/python3 \
    && ln -s /usr/bin/python3.11 /usr/local/bin/python

# Clean up to reduce layer size
RUN apt-get clean && rm -rf /var/lib/apt/lists/*

# Set the working directory in the container
WORKDIR /app
COPY . /app

RUN pip install --no-cache-dir -r requirements.txt
RUN pip install torch torchvision torchaudio --index-url https://download.pytorch.org/whl/cu118

#CMD ["python3", "-c", "import torch; print(torch.cuda.is_available())"]