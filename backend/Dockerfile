# Use an official Python runtime as a parent image
FROM python:3.11.8-slim

# Set the working directory in the container
WORKDIR /usr/src/app

# Copy the current directory contents into the container at /usr/src/app
COPY . ./

# Install any needed packages specified in requirements.txt
RUN pip install --no-cache-dir -r requirements.txt

# Make port 8000 available to the world outside this container
EXPOSE 8000

# Define environment variable
ENV MODULE_NAME=app.main
ENV VARIABLE_NAME=app
ENV WORKERS_PER_CORE=1
ENV WEB_CONCURRENCY=4

# Run the application
CMD ["uvicorn", "app.main:app", "--reload"]
