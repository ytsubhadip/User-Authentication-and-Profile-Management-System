import os
import cloudinary
from dotenv import load_dotenv
from bson import ObjectId
from fastapi import APIRouter, File , HTTPException, UploadFile
import cloudinary.uploader
from database.mongodb import user_collection


load_dotenv()
cloudinary.config(
    cloud_name = os.getenv("CLUDINARY_CLOUD_NAME"),
    api_key = os.getenv("CLOUDINARY_API_KEY"),
    api_secret = os.getenv("CLOUDINARY_API_SECRET"),
    secure = True
)

profile_route = APIRouter(prefix="/api/upload")

@profile_route.post("/profile/{user_id}")
async def profile_upload(user_id:str,image: UploadFile = File(...)):

    # Check image type
    if not image.content_type.startswith("image/"):
        raise HTTPException(
            status_code=400,
            detail="Only image files are allowed"
        )
    print(f"Uploading image for user_id: {user_id}, filename: {image.filename}, content_type: {image.content_type}")
    try:
        # Upload image to cloudnary
        result =  cloudinary.uploader.upload(
            image.file,
            folder = "profile_images",
              resource_type="image"
        )

        image_url = result["secure_url"]

        # Update user DB
        await user_collection.update_one(
            {"_id": ObjectId(user_id)},
            {
                "$set": {
                    "profile_image": image_url
                }
            }
            )

        
        return {
            "message": "Profile image uploaded successfully",
            "profile_image": image_url
        }
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=str(e)
        )

