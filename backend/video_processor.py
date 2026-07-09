import os
import time
import uuid
import shutil
import config
from frame_extractor import frame_extractor
from model import commentary_model
from tts import commentary_tts
from video_merger import video_merger


class VideoProcessor:
    async def process_video(self, input_video_path: str) -> dict:
        """
        Runs the full video processing AI pipeline.
        """

        start_time = time.time()

        run_id = str(uuid.uuid4())

        temp_frames_dir = os.path.join(
            config.UPLOAD_DIR,
            f"frames_{run_id}"
        )

        temp_audio_path = os.path.join(
            config.UPLOAD_DIR,
            f"audio_{run_id}.mp3"
        )

        file_ext = os.path.splitext(input_video_path)[1]

        output_filename = f"processed_{run_id}{file_ext}"

        output_video_path = os.path.join(
            config.OUTPUT_DIR,
            output_filename
        )

        try:

            # 1. Extract Frames
            frames = frame_extractor.extract_frames(
                video_path=input_video_path,
                output_dir=temp_frames_dir,
                mode="fps",
                value=config.DEFAULT_FRAME_RATE,
                resolution=config.DEFAULT_RESOLUTION,
            )

            # 2. Generate Commentary
            commentary = commentary_model.predict(
                video_path=input_video_path,
                frames=frames,
            )

            # 3. Generate Audio
            audio_path = commentary_tts.generate_audio(
                text=commentary,
                output_path=temp_audio_path,
            )

            print("=" * 60)
            print("Generated Audio :", audio_path)
            print("Exists          :", os.path.exists(audio_path))
            print("Size            :", os.path.getsize(audio_path))
            print("=" * 60)

            # 4. Merge
            video_merger.merge(
                video_path=input_video_path,
                audio_path=audio_path,
                output_path=output_video_path,
            )

            processing_time = time.time() - start_time

            return {
                "video_filename": output_filename,
                "commentary": commentary,
                "processing_time": round(processing_time, 2),
            }

        finally:

            if os.path.exists(temp_frames_dir):
                shutil.rmtree(temp_frames_dir, ignore_errors=True)

            # TEMPORARILY KEEP THE MP3 FOR DEBUGGING
            # if os.path.exists(temp_audio_path):
            #     os.remove(temp_audio_path)


video_processor = VideoProcessor()