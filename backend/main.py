import modal
from fastapi import FastAPI

app = modal.App("linear-clone")

# Create a custom image with dependencies from requirements.txt
image = modal.Image.debian_slim().pip_install_from_requirements("requirements.txt")

web_app = FastAPI()


@web_app.get("/")
async def root():
    return {"message": "Linear Clone API"}


@web_app.get("/health")
async def health():
    return {"status": "healthy"}


@app.function(image=image)
@modal.asgi_app()
def fastapi_app():
    return web_app
