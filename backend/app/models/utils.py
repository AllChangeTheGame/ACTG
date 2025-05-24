from datetime import datetime, timezone


def get_utc_time():
    return datetime.now(timezone.utc)
