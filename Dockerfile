# Dockerfile
FROM python:3.6-slim-stretch

# Allow statements and log messages to immediately appear in the Knative logs
ENV PYTHONUNBUFFERED True
ENV PORT=8080

WORKDIR /usr/app

EXPOSE $PORT

RUN apt-get -qq update
RUN apt-get install -y -q \
    build-essential \
    curl

# Install requirements
COPY /src/requirements.txt /tmp/
RUN pip install -r /tmp/requirements.txt
ADD ./src ./

# CMD ["python", "-u", "app.py"]
CMD exec gunicorn --bind :$PORT --workers 1 --threads 8 --timeout 0 app:app

