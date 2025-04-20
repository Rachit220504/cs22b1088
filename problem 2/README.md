# Average Calculator

This project consists of a FastAPI backend and a React frontend that work together to calculate the average of various number sequences.

## Setup and Running

### Backend

1. Navigate to the backend directory:
```
cd backend
```

2. Install dependencies:
```
pip install -r requirements.txt
```

3. Start the FastAPI server:
```
uvicorn app:app --reload --host 0.0.0.0 --port 8000
```

### Frontend

1. Navigate to the frontend directory:
```
cd frontend
```

2. Install dependencies:
```
npm install
```

3. Start the React development server:
```
npm start
```

4. Open your browser and navigate to http://localhost:3000

## API Documentation

FastAPI provides automatic documentation at:
- http://localhost:8000/docs
- http://localhost:8000/redoc

## Notes

- The backend currently uses placeholder URLs for the third-party APIs. Replace them with actual endpoints in production.
- The timeout for third-party API calls is set to 500ms as specified in the requirements.
