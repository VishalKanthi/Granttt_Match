# Granttt Match - Startup Matching Grants

This project is a platform designed to match startups with available grants. It consists of a React frontend and a Python backend.

## Project Structure

- **frontend/**: React application built with Vite, TypeScript, and Tailwind CSS.
- **backend/**: Python application (likely FastAPI or Flask based on structure).

## Getting Started

### Prerequisites

- Node.js installed
- Python installed

### Running the Application

You can use the provided `start.bat` script to run both the frontend and backend servers.

```bash
./start.bat
```

Alternatively, you can run them separately:

**Frontend:**
```bash
cd frontend
npm install
npm run dev
```

**Backend:**
```bash
cd backend
# Create virtual environment if not exists
python -m venv venv
# Activate virtual environment
.\venv\Scripts\activate
pip install -r requirements.txt
python app/main.py
```
