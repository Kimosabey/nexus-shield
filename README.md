# Nexus Shield
### Hybrid AI Security Gateway & Governance Middleware

![Status](https://img.shields.io/badge/Status-Active_Optimization-blue?style=for-the-badge)
![Category](https://img.shields.io/badge/Category-Portfolio_Project-red?style=for-the-badge)

![Nexus Shield — Hybrid AI Security Gateway](docs/assets/hero_main.png)

## Overview
A hybrid AI security gateway and governance middleware. Nexus Shield sits in front of
downstream AI services and **masks PII in real time** (via Presidio) before requests
reach the model — keeping sensitive data out of prompts while preserving utility.

## Quick Start
```bash
# 1. Clone
git clone https://github.com/Kimosabey/nexus-shield.git

# 2. Install
npm install

# 3. Run
npm run dev
```

## Key Features
- **PII masking** — detects and redacts sensitive entities before any model call (Presidio).
- **Governance middleware** — a NestJS gateway fronting downstream AI/LLM services.
- **Hybrid architecture** — local policy/redaction with cloud reasoning offload.
- **Hybrid compute** — application logic runs locally; heavy AI reasoning is offloaded to the cloud.

## Architecture

![Architecture — hybrid security gateway](docs/assets/architecture_hybrid.png)

See [ARCHITECTURE.md](./docs/ARCHITECTURE.md) for the detailed design.

## Documentation
- [Architecture Guide](./docs/ARCHITECTURE.md)
- [Failure Scenarios](./docs/FAILURE_SCENARIOS.md)
- [Getting Started](./docs/GETTING_STARTED.md)
- [Interview Q&A](./docs/INTERVIEW_QA.md)

## Author

**Harshan Aiyappa**
Fullstack Software Engineer — AI & R&D
Voice AI · Distributed Systems · Infrastructure

[![Portfolio](https://img.shields.io/badge/Portfolio-kimo--nexus.vercel.app-00C7B7?style=flat&logo=vercel)](https://kimo-nexus.vercel.app/)
[![GitHub](https://img.shields.io/badge/GitHub-Kimosabey-black?style=flat&logo=github)](https://github.com/Kimosabey)
[![LinkedIn](https://img.shields.io/badge/LinkedIn-Harshan_Aiyappa-blue?style=flat&logo=linkedin)](https://linkedin.com/in/harshan-aiyappa)
[![X](https://img.shields.io/badge/X-@HarshanAiyappa-black?style=flat&logo=x)](https://x.com/HarshanAiyappa)
