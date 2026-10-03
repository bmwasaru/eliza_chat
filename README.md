# ELIZA Web Terminal

A Flask web interface for NLTK's classic ELIZA chatbot with a 1960s-inspired teletype/CRT interface.

## Requirements

- Python 3.9+
- pip

## Setup

```bash
python -m venv venv
```

macOS / Linux:

```bash
source venv/bin/activate
```

Windows:

```powershell
venv\Scripts\activate
```

Install dependencies:

```bash
pip install -r requirements.txt
```

Run:

```bash
python app.py
```

Open:

```text
http://127.0.0.1:5000
```

## Production

Example with Gunicorn:

```bash
gunicorn app:app
```

## Structure

```text
eliza-web/
├── app.py
├── requirements.txt
├── README.md
├── templates/
│   ├── index.html
│   ├── 404.html
│   └── 500.html
└── static/
    ├── css/
    │   └── terminal.css
    └── js/
        └── terminal.js
```
