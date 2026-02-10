# GrantMatch AI Backend

## Setup
```bash
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

## API Endpoints
- POST /api/profile/create - Create user profile
- GET /api/profile/{id} - Get profile
- POST /api/match - Get grant matches
- GET /api/grants/{id} - Get grant details
- POST /api/grants/{id}/analyze - AI application tips
