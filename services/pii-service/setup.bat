@echo off
echo Setting up PII Service...
python -m venv venv
call venv\Scripts\activate
pip install -r requirements.txt
python -m spacy download en_core_web_lg
echo PII Service Setup Complete.
pause
