from gtts import gTTS
import json,os

with open('verbs.json') as f:
 data=json.load(f)

os.makedirs("audio",exist_ok=True)

for v in data:
 t=gTTS(v['base'],lang='en')
 t.save(f"audio/{v['base']}.mp3")
print("ok")
