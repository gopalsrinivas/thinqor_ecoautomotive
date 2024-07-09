# Use an official Python runtime as a parent image
FROM python:3.8-slim-buster

# Set environment variables for Django
ENV PYTHONUNBUFFERED 1

# Set the working directory in the container
WORKDIR / django

# Copy the requirements file into the container
COPY requirements.txt  requirements.txt

# Install any needed packages specified in requirements.txt
RUN pip install -r requirements.txt

# Copy the rest of the application code to the working directory
COPY . .

# Expose the port that the application will run on (e.g., 8000)
EXPOSE 8000

# Run Django
CMD ["python", "manage.py", "runserver", "0.0.0.0:8000"] 
