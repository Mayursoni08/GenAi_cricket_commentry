import os
from moviepy import VideoFileClip, AudioFileClip


class VideoMerger:
    def merge(self, video_path: str, audio_path: str, output_path: str) -> str:

        print("\n" + "=" * 70)
        print("VIDEO MERGER STARTED")
        print("=" * 70)

        print(f"Input Video : {video_path}")
        print(f"Input Audio : {audio_path}")
        print(f"Output Video: {output_path}")

        print("\nChecking files...")

        print("Video Exists :", os.path.exists(video_path))
        print("Audio Exists :", os.path.exists(audio_path))

        os.makedirs(os.path.dirname(output_path), exist_ok=True)

        video = VideoFileClip(video_path)
        audio = AudioFileClip(audio_path)

        print("\nLoaded Successfully")

        print(f"Video Duration : {video.duration:.2f} sec")
        print(f"Audio Duration : {audio.duration:.2f} sec")

        # Trim audio if longer
        if audio.duration > video.duration:
            print("Audio is longer than video. Trimming...")
            audio = audio.subclipped(0, video.duration)

        print("\nRemoving original audio...")
        silent_video = video.without_audio()

        print("Adding commentary audio...")
        final_video = silent_video.with_audio(audio)

        print("\nWriting processed video...")

        final_video.write_videofile(
            output_path,
            codec="libx264",
            audio_codec="aac",
            fps=video.fps,
            logger="bar"
        )

        print("\nMain output created.")

        # -----------------------------------------------------
        # ALSO CREATE A SECOND TEST FILE
        # -----------------------------------------------------

        test_output = os.path.join(
            os.path.dirname(output_path),
            "merged_test.mp4"
        )

        print(f"\nCreating Test File:\n{test_output}")

        video2 = VideoFileClip(video_path)
        audio2 = AudioFileClip(audio_path)

        if audio2.duration > video2.duration:
            audio2 = audio2.subclipped(0, video2.duration)

        test_video = video2.without_audio().with_audio(audio2)

        test_video.write_videofile(
            test_output,
            codec="libx264",
            audio_codec="aac",
            fps=video2.fps,
            logger=None
        )

        test_video.close()
        video2.close()
        audio2.close()

        print("Test file created.")

        final_video.close()
        silent_video.close()
        video.close()
        audio.close()

        print("\nEverything Closed Successfully.")
        print("=" * 70)

        return output_path


video_merger = VideoMerger()