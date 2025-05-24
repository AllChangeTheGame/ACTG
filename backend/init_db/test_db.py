import sys

sys.path.append("..")

from datetime import datetime, timezone
from uuid import UUID

from app import models
from app.db.session import get_db

db = get_db()

# Query all teams from the database
all_teams = db.query(models.Team).all()

# Loop through the teams and print their names (or perform any other desired operations)
for team in all_teams:
    print(team.name)


all_routes = db.query(models.Route).all()

# Don't forget to close the session when you're done using it
# session.close()

route_id = UUID("afcc9191-8499-4db8-be05-fb1466bb29f8")

users = db.query(models.User).all()

for this_user in users:
    loc_log = models.UserLocation(
        latitude=12.1,
        longitude=12.1,
        altitude=10,
        velocity=0,
        accuracy=15,
        user_id=this_user.id,
        logged_time=datetime.now(),
    )
    db.add(loc_log)

db.commit()

loc_log = db.query(models.UserLocation).all()

current_time = datetime.now(timezone.utc)
print(current_time)
valid_share_requests = (
    db.query(models.LocationShareRequest)
    .filter(
        models.LocationShareRequest.request_team_id == UUID("1446e8a4-350c-4aa1-a997-c05fb87ef102"),
        models.LocationShareRequest.request_start_time < current_time,
        models.LocationShareRequest.request_end_time > current_time,
    )
    .all()
)
