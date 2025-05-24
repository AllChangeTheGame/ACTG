import sys

sys.path.append("..")

import csv
from pathlib import Path

from sqlalchemy.orm import Session

from app.db.session import get_db
from app.models import BonusSite, City, Route, ScrewCard, Team, User
from app.utils.decode_verify_jwt import firebase_uid_to_uuid


def seed_data_generic(db: Session, model_cls, data_list, row_parse_function=None, model_cls_kwargs={}):
    try:
        for data in data_list:
            if "int_id" in data.keys():
                del data["int_id"]

            if row_parse_function:
                data = row_parse_function(data)

            data.update(model_cls_kwargs)
            obj = model_cls(**data)

            if not db.query(model_cls).filter(model_cls.id == obj.id).first():
                db.add(obj)

        db.commit()
    except Exception as e:
        db.rollback()
        raise e


def read_csv_data(csv_file):
    with open(csv_file, newline="") as csvfile:
        csvreader = csv.DictReader(csvfile)
        return [row for row in csvreader]


if __name__ == "__main__":
    db = get_db(drop_existing=False)

    data_dir = Path(__file__).parent / "data"

    def parse_route_row(row):
        del row["start_city_int_id"]
        del row["end_city_int_id"]
        del row["start_latitude"]
        del row["start_longitude"]
        del row["end_latitude"]
        del row["end_longitude"]

        return row

    def parse_city_row(row):
        row["is_starter_city"] = row["is_starter_city"] == "True"
        return row

    def parse_user_row(row):
        row["firebase_uid"] = row["id"]
        row["id"] = firebase_uid_to_uuid(row["id"])
        return row

    def parse_site_row(row):
        row["site_name"] = row.pop("location_name")
        row["city"] = row.pop("name")

        del row["is_starter_city"]
        return row

    def parse_screw_card_row(row):
        row["is_active"] = row["is_active"] == "True"
        return row

    try:
        # Seed teams
        team_data = read_csv_data(data_dir / "teams.csv")
        seed_data_generic(db, Team, team_data)

        # Seed users
        user_data = read_csv_data(data_dir / "users.csv")
        seed_data_generic(db, User, user_data, row_parse_function=parse_user_row)

        # Seed cities
        city_data = read_csv_data(data_dir / "cities.csv")
        seed_data_generic(
            db,
            City,
            city_data,
            row_parse_function=parse_city_row,
        )

        # Seed routes
        route_data = read_csv_data(data_dir / "routes.csv")
        seed_data_generic(
            db,
            Route,
            route_data,
            row_parse_function=parse_route_row,
        )

        # Seed bonus sites
        bonus_site_data = read_csv_data(data_dir / "bonus_sites.csv")
        seed_data_generic(
            db,
            BonusSite,
            bonus_site_data,
            row_parse_function=parse_site_row,
        )

        # Seed screw cards
        screw_card_data = read_csv_data(data_dir / "screw_cards.csv")
        seed_data_generic(
            db,
            ScrewCard,
            screw_card_data,
            row_parse_function=parse_screw_card_row,
        )

        db.commit()
    except Exception as e:
        db.rollback()
        raise e
    finally:
        db.close()

    print("Database Loaded")
