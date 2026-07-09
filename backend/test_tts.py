from gtts import gTTS

tts = gTTS(
    text="Hello, this is a test commentary.",
    lang="en"
)

tts.save("test.mp3")

print("Done")