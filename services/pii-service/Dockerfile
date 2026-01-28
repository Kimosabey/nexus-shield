FROM python:3.11-slim

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt
RUN python -m spacy download en_core_web_lg

COPY . .

EXPOSE 8002

CMD ["python", "main.py"]
