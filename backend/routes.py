import os
import shutil
import uuid
from fastapi import APIRouter, UploadFile, File, HTTPException
import config
from video_processor import video_processor

router = APIRouter()

@router.post("/predict")
async def predict_commentary(video: UploadFile = File(...)):
    # Validate file format
    allowed_extensions = {".mp4", ".avi", ".mov", ".mkv", ".webm"}
    file_ext = os.path.splitext(video.filename)[1].lower() if video.filename else ""
    if not file_ext or file_ext not in allowed_extensions:
        raise HTTPException(
            status_code=400,
            detail=f"Unsupported file format. Supported formats: {', '.join(allowed_extensions)}"
        )

    # Save uploaded file temporarily to config.UPLOAD_DIR
    unique_filename = f"upload_{uuid.uuid4()}{file_ext}"
    input_video_path = os.path.join(config.UPLOAD_DIR, unique_filename)

    try:
        # Save input file
        with open(input_video_path, "wb") as buffer:
            shutil.copyfileobj(video.file, buffer)
            
        # Execute the AI commentary pipeline
        result = await video_processor.process_video(input_video_path)
        
        return {
            "success": True,
            "video_url": f"/outputs/{result['video_filename']}",
            "commentary": result["commentary"],
            "processing_time": result["processing_time"]
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        # Close upload file handle
        await video.close()
        # Clean up the raw uploaded video file as we now have the processed copy
        if os.path.exists(input_video_path):
            try:
                os.remove(input_video_path)
            except Exception:
                pass
