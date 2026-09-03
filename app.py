from fastapi import FastAPI, HTTPException, Request
from fastapi.templating import Jinja2Templates
from fastapi.staticfiles import StaticFiles

from routes.auth_routes import auth_route
from database.mongodb import db

app = FastAPI(
    title="User Authentication and Profile Management System"
)

# tempate file config
templates = Jinja2Templates(directory="templates")

# static file config
app.mount(
    "/static",
    StaticFiles(directory="static"),
    name="static"
)

# add all route
app.include_router(auth_route)

@app.get("/")
async def root(request:Request):

    return templates.TemplateResponse(
          request=request,
          name="registration.html"
    )




# db check endpoint
@app.get("/db-check")
async def dbcheck():
    try:
        await db.command("ping")

        return{
            "status": "healthy",
            "database":"connecter",
        }
    
    except Exception as e:

        raise HTTPException(status_code=503, 
                            detail={
                                "status":"unhealthy",
                                "databse":"disconnected",
                                "error":str(e)
                            }) 



