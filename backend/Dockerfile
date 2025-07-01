# Step 1: Use Python 3.11 as the base image
FROM python:3.11-slim

# Step 2: Set environment variable to prevent Python from buffering stdout and stderr
ENV PYTHONUNBUFFERED 1

# Step 3: Set the working directory inside the container to /app
WORKDIR /app

# Step 4: Copy the requirements.txt into the container
COPY requirements.txt /app/

# Step 5: Install Python dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Step 6: Copy the rest of the application code into the container
COPY . /app/

# Step 7: Expose port 8000 (default Django port)
EXPOSE 8000

# Step 8: Run Django migrations, collect static files, and start the app with Gunicorn
CMD python manage.py migrate && \
    python manage.py collectstatic --noinput && \
    gunicorn backend.wsgi:application --bind 0.0.0.0:8000
