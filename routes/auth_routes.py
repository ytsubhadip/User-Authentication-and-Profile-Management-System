from fastapi import APIRouter, HTTPException, Body
from schemas.user_schema import UserRegistration
from database.mongodb import user_collection


auth_route = APIRouter(prefix="/api/auth")


@auth_route.post("/register")
async def user_create(user : UserRegistration=Body(...)):

    user_data = user.model_dump()

    # Convert date to string
    user_data["date_of_birth"] = user.date_of_birth.isoformat()
    print(user_data)
    try:
        result = await user_collection.insert_one(user_data)

        return{
            "status":"successfull",
            "user_id":str(result.inserted_id)
        }
    
    except Exception as e:
        return{
            "status":"unsuccessfull",
            "error":str(e)
        }
    

