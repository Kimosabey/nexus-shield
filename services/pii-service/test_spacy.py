import time
import spacy
from presidio_analyzer import AnalyzerEngine

def test_speed():
    print("Loading spaCy model (en_core_web_lg)... this might take a moment first time...")
    start_load = time.time()
    # Presidio loads the model internally, but we can check spacy directly too
    nlp = spacy.load("en_core_web_lg")
    analyzer = AnalyzerEngine()
    print(f"Model Load Time: {time.time() - start_load:.4f}s")
    
    text = "My name is Harshan Aiyappa and my email is harshan@example.com. Please ignore this."
    
    print(f"\nAnalyzing Text: '{text}'")
    start_analyze = time.time()
    results = analyzer.analyze(text=text, language='en')
    duration = (time.time() - start_analyze) * 1000
    
    print(f"Analysis Duration: {duration:.2f}ms")
    print("\nResults:")
    for res in results:
        print(f"- {res.entity_type}: {text[res.start:res.end]}")
        
    if duration < 100:
        print("\n✅ PASSED: Logic Zone is Optimized (<100ms)")
    else:
        print("\n⚠️ WARNING: Analysis is slower than expected.")

if __name__ == "__main__":
    test_speed()
