from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import httpx
import asyncio
from collections import deque
import statistics

app = FastAPI(title="Average Calculator")

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Simulated third-party URLs (replace with actual URLs in production)
NUMBER_APIS = {
    "p": "https://example.com/api/prime-numbers",    # Replace with actual prime numbers API
    "f": "https://example.com/api/fibonacci-numbers", # Replace with actual Fibonacci API
    "e": "https://example.com/api/even-numbers",     # Replace with actual even numbers API
    "r": "https://example.com/api/random-numbers",   # Replace with actual random numbers API
}

# Initialize sliding window for each number type
sliding_windows = {
    "p": deque(maxlen=10),
    "f": deque(maxlen=10),
    "e": deque(maxlen=10),
    "r": deque(maxlen=10),
}

@app.get("/numbers/{number_id}")
async def get_numbers(number_id: str):
    if number_id not in NUMBER_APIS:
        raise HTTPException(status_code=400, detail="Invalid number ID. Use 'p', 'f', 'e', or 'r'")
    
    # Store previous window state
    window_prev_state = list(sliding_windows[number_id])
    
    # Fetch numbers from third-party API with timeout
    try:
        async with httpx.AsyncClient() as client:
            response = await asyncio.wait_for(
                client.get(NUMBER_APIS[number_id]),
                timeout=0.5  # 500ms timeout
            )
            
            if response.status_code == 200:
                new_numbers = response.json()
                # Filter out non-unique numbers
                unique_new_numbers = []
                for num in new_numbers:
                    if num not in sliding_windows[number_id]:
                        unique_new_numbers.append(num)
                        # Add to sliding window (deque handles removing oldest if full)
                        sliding_windows[number_id].append(num)
            else:
                raise HTTPException(status_code=response.status_code, detail="Error fetching from third-party API")
                
    except asyncio.TimeoutError:
        # Handle timeout gracefully
        return {
            "windowPrevState": window_prev_state,
            "windowCurrState": list(sliding_windows[number_id]),
            "numbers": [],
            "avg": round(statistics.mean(sliding_windows[number_id]) if sliding_windows[number_id] else 0, 2)
        }
    
    # Calculate average
    current_window = list(sliding_windows[number_id])
    avg = round(statistics.mean(current_window) if current_window else 0, 2)
    
    return {
        "windowPrevState": window_prev_state,
        "windowCurrState": current_window,
        "numbers": unique_new_numbers,
        "avg": avg
    }
