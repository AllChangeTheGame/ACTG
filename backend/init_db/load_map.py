from pathlib import Path

import pandas as pd
from geopy.distance import distance
from map_utils import load_kml_map

REGENERATE = True
DATA_FOLDER = Path(__file__).parent / "data"
out_files = {key: DATA_FOLDER / f"{key}.csv" for key in ["cities", "routes", "bonus_sites"]}

kml_file = DATA_FOLDER / "map_files" / "Ticket to Ride Live.kml"


if not all([out_file.exists() for out_file in out_files.values()]) or REGENERATE:
    cities_df, routes_df, bonus_sites_df = load_kml_map(kml_file)

    for out_file, df in zip(out_files.values(), [cities_df, routes_df, bonus_sites_df]):
        df.to_csv(out_file, index=False)

else:
    cities_df = pd.read_csv(out_files["cities"])
    routes_df = pd.read_csv(out_files["routes"])
    bonus_sites_df = pd.read_csv(out_files["bonus_sites"])

routes_df["distance"] = routes_df.apply(
    lambda row: round(
        distance((row["start_latitude"], row["start_longitude"]), (row["end_latitude"], row["end_longitude"])).km
    ),
    axis=1,
)

routes_df.to_csv(out_files["routes"], index=False)

bonus_sites_df["site_value"] = 100
bonus_sites_df.to_csv(out_files["bonus_sites"], index=False)
