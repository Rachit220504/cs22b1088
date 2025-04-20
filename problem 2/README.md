# Average Calculator

This project consists of a FastAPI backend and a React frontend that work together to calculate the average of various number sequences.

## Prerequisites

- Python 3.7+ with pip installed
- Node.js 14+ with npm installed

## Setup and Running

### Backend

1. Navigate to the backend directory:
```
cd d:\tp\problem 2\backend
```

2. Install dependencies:
```
pip install -r requirements.txt
```

3. Start the FastAPI server:
```
uvicorn app:app --reload --host 0.0.0.0 --port 8000
```

The backend will be available at http://localhost:8000

### Frontend

1. Navigate to the frontend directory:
```
cd d:\tp\problem 2\frontend
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

## Testing the Application

1. Make sure both the backend and frontend servers are running
2. Go to http://localhost:3000 in your browser
3. Select a number type from the dropdown
4. Click "Fetch Numbers" to retrieve data from the third-party API
5. View the results displayed on the page

## API Documentation

FastAPI provides automatic documentation at:
- http://localhost:8000/docs (Swagger UI)
- http://localhost:8000/redoc (ReDoc)

## Important Notes

- The backend currently uses placeholder URLs for the third-party APIs. Replace them in the `NUMBER_APIS` dictionary in `app.py` with actual endpoints for the application to work properly.
- The timeout for third-party API calls is set to 500ms as specified in the requirements.

## Troubleshooting

- If the frontend can't connect to the backend, ensure the backend server is running and check for CORS issues
- If you encounter "Module not found" errors in the backend, make sure all dependencies are installed
- For frontend build issues, try deleting the `node_modules` folder and running `npm install` again

## Checking the Output

### Method 1: Using the React UI (Recommended)

1. Start both the backend and frontend servers as described in the Setup section
2. Open your browser and navigate to http://localhost:3000
3. Select a number type from the dropdown (Prime, Fibonacci, Even, or Random)
4. Click the "Fetch Numbers" button
5. Observe the results displayed in four cards:
   - **Previous Window State**: The state of the sliding window before the request
   - **Current Window State**: The state of the sliding window after adding new numbers
   - **New Numbers Added**: Only the unique new numbers that were added to the window
   - **Average**: The calculated average of all numbers in the current window

### Method 2: Using the API Directly

You can test the backend API directly using tools like curl, Postman, or directly in the browser:

```bash
# Using curl
curl http://localhost:8000/numbers/p

# Or simply open in browser
http://localhost:8000/numbers/p
```

Try different number types by changing the last parameter:
- `/numbers/p` - Prime numbers
- `/numbers/f` - Fibonacci numbers
- `/numbers/e` - Even numbers
- `/numbers/r` - Random numbers

### Method 3: Using the FastAPI Documentation

FastAPI provides interactive documentation:

1. Open http://localhost:8000/docs in your browser
2. Find the GET `/numbers/{number_id}` endpoint
3. Click "Try it out"
4. Enter a number_id (p, f, e, or r)
5. Click "Execute"
6. View the server response below

### Expected Output Format

The API response will be in JSON format:

```json
{
  "windowPrevState": [1, 2, 3, ...],  // Numbers in window before request
  "windowCurrState": [1, 2, 3, 4, ...],  // Numbers in window after request
  "numbers": [4, ...],  // New unique numbers added in this request
  "avg": 2.5  // Average of all numbers in current window
}
```

### Note on Third-Party APIs

The current implementation uses placeholder URLs. To get real data:

1. Replace the URLs in the `NUMBER_APIS` dictionary in `app.py` with actual endpoints
2. Restart the backend server
