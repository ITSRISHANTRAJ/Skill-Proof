import shutil
import os

src_files = [
    "/Users/rishant/.gemini/antigravity/brain/65475a84-bf73-43e1-ae4d-73db480c3448/media__1771763356671.png",
    "/Users/rishant/.gemini/antigravity/brain/65475a84-bf73-43e1-ae4d-73db480c3448/media__1771763364961.png",
    "/Users/rishant/.gemini/antigravity/brain/65475a84-bf73-43e1-ae4d-73db480c3448/media__1771763380047.png"
]

os.makedirs("images", exist_ok=True)
for i, f in enumerate(src_files):
    shutil.copy(f, f"images/hero{i+1}.png")
