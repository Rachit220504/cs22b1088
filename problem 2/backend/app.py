from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import httpx
import asyncio
from collections import deque
import statistics
import random
import time

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

# Mock data for testing when external APIs are unavailable
def get_mock_data(number_id: str, count: int = 5) -> list:
    """Generate mock data for testing purposes."""
    if number_id == "p":
        # Prime numbers
        primes = [2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37, 41, 43, 47]
        return random.sample(primes, min(count, len(primes)))
    
    elif number_id == "f":
        # Fibonacci numbers
        fibonacci = [1, 1, 2, 3, 5, 8, 13, 21, 34, 55, 89, 144, 233]
        return random.sample(fibonacci, min(count, len(fibonacci)))
    
    elif number_id == "e":
        # Even numbers
        return [random.randint(1, 10) * 2 for _ in range(count)]
    
    elif number_id == "r":
        # Random numbers
        return [random.randint(1, 100) for _ in range(count)]
    
    return []

@app.get("/numbers/{number_id}")
async def get_numbers(number_id: str, use_mock: bool = False):
    if number_id not in NUMBER_APIS:
        raise HTTPException(status_code=400, detail="Invalid number ID. Use 'p', 'f', 'e', or 'r'")
    
    # Store previous window state
    window_prev_state = list(sliding_windows[number_id])
    
    # Use mock data if requested or try to fetch from API
    try:
        if use_mock:
            # Simulate API delay (0-300ms) for realistic testing
            await asyncio.sleep(random.uniform(0, 0.3))
            new_numbers = get_mock_data(number_id)
        else:
            # Try fetching from third-party API with timeout
            async with httpx.AsyncClient() as client:
                response = await asyncio.wait_for(
                    client.get(NUMBER_APIS[number_id]),
                    timeout=0.5  # 500ms timeout
                )
                
                if response.status_code == 200:
                    new_numbers = response.json()
                else:
                    # Fall back to mock data if API request fails
                    new_numbers = get_mock_data(number_id)
                
    except (asyncio.TimeoutError, httpx.ConnectError, httpx.RequestError):
        # Handle timeout or connection error by using mock data
        new_numbers = get_mock_data(number_id)
        
    # Filter out non-unique numbers
    unique_new_numbers = []
    for num in new_numbers:
        if num not in sliding_windows[number_id]:
            unique_new_numbers.append(num)
            # Add to sliding window (deque handles removing oldest if full)
            sliding_windows[number_id].append(num)
    
    # Calculate average
    current_window = list(sliding_windows[number_id])
    avg = round(statistics.mean(current_window) if current_window else 0, 2)
    
    return {
        "windowPrevState": window_prev_state,
        "windowCurrState": current_window,
        "numbers": unique_new_numbers,
        "avg": avg
    }
