from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel
import requests
import json
import os
from dotenv import load_dotenv

load_dotenv()

app = FastAPI()

# Allow CORS for development
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class RouteRequest(BaseModel):
    prompt: str

OPENROUTER_API_KEY = os.getenv("OPENROUTER_API_KEY")

@app.get("/")
async def read_index():
    return FileResponse('index.html')

@app.on_event("startup")
async def startup_event():
    print("Server starting...")
    if OPENROUTER_API_KEY:
        print(f"API Key loaded. Length: {len(OPENROUTER_API_KEY)}")
        print(f"Model selected: {os.getenv('OPENROUTER_MODEL', 'Not set')}")
    else:
        print("CRITICAL WARNING: OPENROUTER_API_KEY is missing from environment!")

@app.post("/api/generate-route")
async def generate_route(req: RouteRequest):
    print(f"Received request for prompt: {req.prompt}")
    
    if not OPENROUTER_API_KEY:
        print("Error: API Key is missing.")
        raise HTTPException(status_code=500, detail="Server missing OPENROUTER_API_KEY. Check .env file.")

    system_prompt = """
    You are a Travel Architect API. You generate structured travel routes based on user "vibes" or requests.
    
    You MUST return ONLY a valid JSON array. No markdown formatting, no explanations.
    
    The JSON objects must follow this exact schema:
    {
        "name": "City Name",
        "lat": float,
        "lng": float,
        "modeToNext": "car" | "plane" | "direct", 
        "markerColor": "hex string" (choose a color matching the vibe),
        "labelColor": "hex string" (usually contrasted to marker or map),
        "pathColor": "hex string" (color of line to NEXT city)
    }

    Rules:
    1. Provide 4-8 cities per route unless specified.
    2. Approximate coordinates are fine, but try to be accurate.
    3. Choose 'modeToNext' logically (long dist = plane, short = car).
    4. ALWAYS use '#ffffff' for markerColor.
    5. ALWAYS use '#000000' for labelColor and pathColor. Do not generate random colors.
    6. The last city's pathColor/modeToNext doesn't matter much but include them.
    7. Do NOT include markdown code blocks (like ```json), just the raw JSON string.
    """

    user_prompt = f"Generate a route for: {req.prompt}"

    try:
        print("Sending request to OpenRouter...")
        response = requests.post(
            url="https://openrouter.ai/api/v1/chat/completions",
            headers={
                "Authorization": f"Bearer {OPENROUTER_API_KEY}",
                "Content-Type": "application/json",
                "HTTP-Referer": "http://localhost:8000", 
                "X-Title": "Vuja Mapapp"
            },
            json={
                "model": os.getenv("OPENROUTER_MODEL", "google/gemini-2.0-flash-exp:free"),
                "messages": [
                    {"role": "system", "content": system_prompt},
                    {"role": "user", "content": user_prompt}
                ]
            }
        )
        
        print(f"OpenRouter Status: {response.status_code}")
        
        if response.status_code != 200:
            print("OpenRouter Error Body:", response.text)
            raise HTTPException(status_code=502, detail=f"AI Provider Error: {response.text}")

        data = response.json()
        if 'choices' not in data:
            print("Unexpected API format:", data)
            raise HTTPException(status_code=500, detail="Unexpected API response format")
            
        raw_content = data['choices'][0]['message']['content']
        print("Raw AI Content (truncated):", raw_content[:100] + "...")
        
        # Cleanup potential markdown ticks if model disobeys
        clean_content = raw_content.replace('```json', '').replace('```', '').strip()
        
        route_data = json.loads(clean_content)
        print("Successfully parsed JSON route data.")
        return route_data

    except json.JSONDecodeError as je:
        print("Failed to decode JSON. Raw content was:")
        print(raw_content)
        raise HTTPException(status_code=500, detail="AI returned invalid JSON")
    except Exception as e:
        print(f"Exception during processing: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

# If we want to serve other static files (like if we had separate css/js)
# app.mount("/static", StaticFiles(directory="static"), name="static")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
