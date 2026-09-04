from fastapi import APIRouter, HTTPException, Body
from schemas.user_schema import UserRegistration, UserLogin
from database.mongodb import user_collection
from services.otp_services import generate_otp, send_email
from datetime import datetime, timedelta
from schemas.user_schema import VerifyOTP


auth_route = APIRouter(prefix="/api/auth")


@auth_route.post("/register")
async def user_create(user : UserRegistration=Body(...)):

    # check already user exist
    existing_user = await user_collection.find_one({"email":user.email})
    if existing_user:
        raise HTTPException(
            status_code=400,
            detail="Email already registered"
        )

    # create otp
    otp = generate_otp()

    #save user data
    user_data = user.model_dump()
    user_data["email_verified"] = False
    user_data["date_of_birth"] = user.date_of_birth.isoformat() # Convert date to string
    user_data["otp"] = otp
    user_data["expiry_time"] = datetime.utcnow() + timedelta(minutes=5)

    print(user_data)

    try:
        # save DB 
        result = await user_collection.insert_one(user_data)
        # send otp
        send_email(user.email, otp)

        return{
             "message": "Registration successful. OTP sent to your email.",
             "email": user.email
        }
    
    except Exception as e:
        return{
            "status":"unsuccessfull",
            "error":str(e)
        }
    

@auth_route.post("/verify-email")
async def verify_email(data:VerifyOTP):

    # Find user by email
    user = await user_collection.find_one({"email": data.email})
    if not user:
        raise HTTPException(
            status_code=404,
            detail="user not found"
        )

    # Check if already verified
    if user.get("email_verified"):
        return {"message": "Email already verified."}
    
    # Check OTP expiry
    if datetime.utcnow() > user["expiry_time"]:
        raise HTTPException(
            status_code=400,
            detail="OTP expired"
        )

     # Check OTP
    if user.get("otp") != data.otp:
        raise HTTPException(
            status_code=400,
            detail="Invalid OTP"
        )

    # OTP is correct → verify user
    await user_collection.update_one(
        {"email": data.email},
        {
            "$set": {
                "email_verified": True
            },
            "$unset": {
                "otp": "",
                "expiry_time": ""
            }
        }
    )

    return {
        "message": "Email verified successfully"
    }

@auth_route.post("/resend-otp")
async def resend_otp(data: VerifyOTP):
    # Find user by email
    user = await user_collection.find_one({"email": data.email})
    if not user:
        raise HTTPException(
            status_code=404,
            detail="user not found" 
        )

    # Check if already verified
    if user.get("email_verified"):
        return {"message": "Email already verified."}

    # Generate new OTP
    otp = generate_otp()
    expiry_time = datetime.utcnow() + timedelta(minutes=5)

    # Update user with new OTP and expiry time
    await user_collection.update_one(
        {"email": data.email},
        {
            "$set": {
                "otp": otp,
                "expiry_time": expiry_time
            }
        }
    )

    # Send new OTP via email
    send_email(data.email, otp)

    return {
        "message": "New OTP sent to your email."
    }


@auth_route.post("/login")
async def login(data: UserLogin):
    user_email = data.email
    user_password = data.password

    #check user in database
    user = await user_collection.find_one({'email':user_email})

    # check user exists
    if not user:
        raise HTTPException(
            status_code=404,
            detail="Email not found"
        )

    # check email verification
    if not user.get("email_verified",False):
        raise HTTPException(
            status_code=403,
            detail="Please verify your email first"
        )

    # check password
    if user.get("password") != user_password :
          raise HTTPException(
            status_code=401,
            detail="Incorrect password"
        )
    print(user.get("profile_image"))
    
     # Login successful
    return {
        "message": "Login successful",
        "user_id": str(user.get("_id")),
        "user": {
            "email": user.get("email"),
            "full_name": user.get("full_name"),
            "phone_number": user.get("phone_number"),
            "date_of_birth": user.get("date_of_birth"),
            "profile_image": user.get("profile_image")
        }
    }

    


    

         
    