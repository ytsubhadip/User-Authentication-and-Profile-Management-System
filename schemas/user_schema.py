import re
from pydantic import BaseModel, Field, EmailStr, field_validator
from typing import Optional
from datetime import date

#  user registration schema
class UserRegistration(BaseModel):
    
    full_name : str= Field(description="User Full Name")
    email: EmailStr =Field(description="User Email Address")
    phone_number:str = Field(min_length=10, max_length=10, description="User Phone Number")
    date_of_birth : date =Field(description="User DOB")
    password: str = Field(description="User Password")

    # password validation 
    @field_validator("password")
    @classmethod        
    def password_validator(cls, password:str):

        # Minimum 10 character
        if len(password) < 10:
            raise ValueError("Password must be at least 10 character long")

        # At least one alphabet 
        if not re.search(r"[A-Za-z]", password):
            raise ValueError()       
        
         # At least one number
        if not re.search(r"\d", password):
            raise ValueError(
                "Password must contain at least one number"
            )

        # At least one special character
        if not re.search(r"[^A-Za-z0-9]", password):
            raise ValueError(
                "Password must contain at least one special character"
            )

        return password

    # add input default example
    model_config ={
        "json_schema_extra":{
            "example":{
                "full_name":"subhadip bar",
                "email":"ytsubhadip0099@gmail.com",
                "phone_number":"9883141505",
                "date_of_birth": "2006-12-02",
                "password":"ytsubhadip"
            }
        }
    }

class VerifyOTP(BaseModel):
    email: EmailStr
    otp: str


class UserLogin(BaseModel):
    email: EmailStr
    password: str