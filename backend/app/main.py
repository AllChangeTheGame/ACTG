from fastapi import FastAPI, Request
from mangum import Mangum

from app.api.routes.cities import router as cities_router
from app.api.routes.claimed_distance import router as claimed_distance_router
from app.api.routes.routes import router as routes_router
from app.api.routes.screw_cards import router as screw_cards_router
from app.api.routes.sites import router as sites_router
from app.api.routes.teams import router as teams_router
from app.api.routes.user_locations import router as user_locations_router

API_PREFIX = "/api"

# Create the FastAPI application
app = FastAPI()

app.include_router(teams_router, tags=["Teams"], prefix=API_PREFIX)
app.include_router(routes_router, tags=["Routes"], prefix=API_PREFIX)
app.include_router(sites_router, tags=["Sites"], prefix=API_PREFIX)
app.include_router(cities_router, tags=["Cities"], prefix=API_PREFIX)
app.include_router(claimed_distance_router, tags=["Claimed Distance"], prefix=API_PREFIX)
app.include_router(screw_cards_router, tags=["Screw Cards"], prefix=API_PREFIX)
app.include_router(user_locations_router, tags=["User Locations"], prefix=API_PREFIX)


@app.get("/")
async def root():
    return {"message": "Hello /"}


# Debugging purposes only.
@app.api_route("/{full_path:path}", methods=["GET"])
async def capture_routes(request: Request, full_path: str):
    url = request.url
    print(full_path)
    print(url)
    return {"url": str(url)}


handler = Mangum(app, lifespan="off")
