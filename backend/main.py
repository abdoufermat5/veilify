import base64
import json

from fastapi import FastAPI, File, UploadFile, HTTPException, Form
from PIL import Image
from io import BytesIO
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

# Set up CORS
origins = [
    "http://localhost:3000",  # React app
    "http://localhost:8000",  # FastAPI server (if needed)
    # you can add more origins if required
    "https://veilify.vercel.app/"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
async def root():
    return {"message": "Hello welcome to Veilify"}

@app.post("/upload/")
async def upload_image(file: UploadFile = File(...), blur_coordinates: str = Form(...)):
    blur_coordinates = json.loads(blur_coordinates)

    print("COORDINATES", blur_coordinates, type(blur_coordinates))
    for el in blur_coordinates:
        print(el, type(el))
    try:
        # Load the image
        image_content = await file.read()
        image = Image.open(BytesIO(image_content))

        # Replace the selected areas with black color
        for coords in blur_coordinates:
            x, y, w, h = coords
            black_rectangle = Image.new("RGB", (w, h), "black")  # Create a black rectangle
            image.paste(black_rectangle, (x, y))  # Paste it onto the main image

        # Save the image with black rectangles to memory
        img_byte_array = BytesIO()
        image.save(img_byte_array, format="PNG")
        base64_encoded = base64.b64encode(img_byte_array.getvalue()).decode("utf-8")
        return {
            "filename": file.filename,
            "content_type": file.content_type,
            "blurred_image": base64_encoded
        }

    except Exception as e:
        print(f"Error: {e}")
        import traceback
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=str(e))
