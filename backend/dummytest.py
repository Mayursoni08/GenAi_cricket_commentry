from moviepy import VideoFileClip

clip = VideoFileClip(
    r"C:\Users\parlv\.gemini\antigravity\scratch\cricket-ai\backend\outputs\processed_bcc479cb-a7bc-4bf0-948e-6f92b48a7057.mp4"
)

clip.audio.write_audiofile("extracted.mp3")