from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from presidio_analyzer import AnalyzerEngine
from presidio_anonymizer import AnonymizerEngine
from presidio_anonymizer.entities import OperatorConfig
import uvicorn
import os

app = FastAPI(title="Nexus Shield - PII Service")

# Initialize Presidio
analyzer = AnalyzerEngine()
anonymizer = AnonymizerEngine()

class PIIRequest(BaseModel):
    text: str
    score_threshold: float = 0.4

class PIIResponse(BaseModel):
    original_text: str
    scrubbed_text: str
    detected_entities: list

@app.get("/health")
async def health():
    return {"status": "ok", "engine": "presidio"}

@app.post("/analyze", response_model=PIIResponse)
async def analyze_text(request: PIIRequest):
    try:
        # 1. Analyze for PII
        results = analyzer.analyze(text=request.text, language='en', score_threshold=request.score_threshold)
        
        # 2. Anonymize
        operators = {
            "DEFAULT": OperatorConfig("replace", {"new_value": "[REDACTED]"}),
            "PHONE_NUMBER": OperatorConfig("mask", {"masking_char": "*", "number_of_chars": 10, "chars_to_mask": 10, "from_end": True}),
        }
        
        anonymized_result = anonymizer.anonymize(
            text=request.text,
            analyzer_results=results,
            operators=operators
        )
        
        detected = [
            {"type": res.entity_type, "score": res.score, "start": res.start, "end": res.end}
            for res in results
        ]
        
        return PIIResponse(
            original_text=request.text,
            scrubbed_text=anonymized_result.text,
            detected_entities=detected
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8002)
