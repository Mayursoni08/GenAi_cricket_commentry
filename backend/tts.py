import os
from gtts import gTTS


class CommentaryTTS:
    def generate_audio(self, text: str, output_path: str) -> str:
        """
        Generate commentary audio using Google Text-to-Speech.
        """

        os.makedirs(os.path.dirname(output_path), exist_ok=True)

        # Ensure MP3 extension
        output_path = os.path.splitext(output_path)[0] + ".mp3"

        tts = gTTS(
            text=text,
            lang="en",
            slow=False
        )

        tts.save(output_path)

        return output_path


commentary_tts = CommentaryTTS()