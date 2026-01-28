# Failure Scenarios & Safe-Handling

Nexus Shield is designed with a **Fail-Safe** philosophy. If a security check cannot be performed, the system defaults to blocking the request.

## 🔴 Scenario 1: PII Service Offline
- **Detection**: Gateway receives `ECONNREFUSED` from PII service.
- **Handling**: The request is intercepted. A `503 Service Unavailable` is returned to the user with the message: "Security Validation Layer Offline."
- **Logging**: Logged as a Critical System Threat.

## 🔴 Scenario 2: Ollama/Phi-3 Latency
- **Detection**: Injection check takes > 2 seconds.
- **Handling**: Circuit breaker trips. The prompt is queued for async analysis, but the immediate response is blocked to prevent potential injection.
- **Mitigation**: Switch to a hybrid cloud backup check (Optional/Configurable).

## 🟡 Scenario 3: PII Masking Ambiguity
- **Detection**: Presidio returns a low confidence score (< 0.4) for a PII entity.
- **Handling**: The system flags the content for "Human-in-the-Loop" review if configured, or masks it aggressively to be safe.

## 🔴 Scenario 4: Output Guard Violation
- **Detection**: LLM response contains a string matching a regex pattern for API Keys.
- **Handling**: The entire response is blocked. The user receives: "Output contains sensitive data and has been redacted for your protection."
- **Trace**: The original output is stored in an encrypted audit log for admin investigation.
