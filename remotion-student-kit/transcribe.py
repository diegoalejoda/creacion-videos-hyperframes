import json, sys
import truststore
truststore.inject_into_ssl()
from faster_whisper import WhisperModel

audio = sys.argv[1] if len(sys.argv) > 1 else "public/audio.wav"
out = sys.argv[2] if len(sys.argv) > 2 else "words.json"

model = WhisperModel("medium", device="cpu", compute_type="int8")
segments, info = model.transcribe(
    audio, language="es", word_timestamps=True,
    vad_filter=True, beam_size=5,
)

words = []
seg_list = []
for seg in segments:
    seg_list.append({"start": round(seg.start, 3), "end": round(seg.end, 3), "text": seg.text.strip()})
    for w in (seg.words or []):
        words.append({"t": w.word.strip(), "start": round(w.start, 3), "end": round(w.end, 3)})
    print(f"[{seg.start:6.2f}-{seg.end:6.2f}] {seg.text.strip()}", flush=True)

with open(out, "w", encoding="utf-8") as f:
    json.dump({"words": words, "segments": seg_list}, f, ensure_ascii=False, indent=1)
print(f"\nWROTE {out}: {len(words)} words, {len(seg_list)} segments", flush=True)
