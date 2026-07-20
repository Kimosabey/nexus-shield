# Getting Started: Nexus Shield

## Prerequisites
- **Node.js**: v18+
- **Python**: 3.10+ (with `spaCy` en_core_web_lg)
- **Redis**: Running locally or via Docker
- **Dedicated Inference Server**: Access to `10.10.20.225` (or configured remote server)

## Installation

### 1. PII Scrubber Service (Python)
```bash
cd services/pii-service
# Installs Presidio + spaCy en_core_web_lg
pip install -r requirements.txt
python -m spacy download en_core_web_lg
# Start the service
python main.py
```

### 2. Shield Gateway (NestJS)
```bash
cd gateway
npm install
npm run start:dev
# Running on http://localhost:3002
```

### 3. Monitoring UI (Next.js + Hero UI)
```bash
cd web
npm install
npm run dev
# Running on http://localhost:3000
```

---

## Configuration
Create a `.env` file in the `gateway` directory:
```env
PORT=3002
PII_SERVICE_URL=http://localhost:8002
OLLAMA_URL=http://10.10.20.225:11434
INJECTION_PROVIDER=openai 
OPENAI_API_KEY=your_key_here
REDIS_URL=redis://localhost:6379
```

## Running the Security Loop
1.  Ensure **Redis** is running.
2.  Start the **PII Service** (Port 8002).
3.  Start the **Gateway** (Port 3002).
4.  Launch the **Hero UI Dashboard** (Port 3000).
