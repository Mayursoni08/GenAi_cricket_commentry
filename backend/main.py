from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from routes import router as api_router
import config

app = FastAPI(
    title="🏏 Cricket AI Commentary API",
    description="Backend API for uploading cricket videos and generating AI commentary",
    version="1.0.0"
)

# Enable CORS for React Frontend development server
origins = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Serve the processed video outputs statically
app.mount("/outputs", StaticFiles(directory=config.OUTPUT_DIR), name="outputs")

@app.get("/")
def read_root():
    return {
        "status": "online",
        "message": "Cricket AI Commentary API is running. Use POST /predict to generate commentary."
    }

# Include routers
app.include_router(api_router)
