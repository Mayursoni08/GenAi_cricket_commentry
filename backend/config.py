import os

# Project Root Paths
BASE_DIR = os.path.dirname(os.path.abspath(__file__))

# Folder settings
UPLOAD_DIR = os.path.join(BASE_DIR, "uploads")
OUTPUT_DIR = os.path.join(BASE_DIR, "outputs")
MODEL_DIR = os.path.join(BASE_DIR, "models")

# Ensure all target folders exist
os.makedirs(UPLOAD_DIR, exist_ok=True)
os.makedirs(OUTPUT_DIR, exist_ok=True)
os.makedirs(MODEL_DIR, exist_ok=True)

# Frame extraction settings
DEFAULT_FRAME_RATE = 1.0     # Extract 1 frame per second by default
DEFAULT_RESOLUTION = None    # Keep original resolution, or specify (width, height) e.g. (640, 480)

# Model Settings
LLAVA_MODEL_ID = "may-ur08/llava-commentary-gen"
BART_MODEL_ID = "facebook/bart-large-cnn"
