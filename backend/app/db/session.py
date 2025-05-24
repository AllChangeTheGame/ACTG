import os

from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

from app.models.base import Base


def get_database_uri():
    DB_DATA_KEYS = ["DB_USER", "DB_PASSWORD", "DB_HOST", "DB_PORT", "DB_NAME"]

    template_string = "postgresql+psycopg2://{DB_USER}:{DB_PASSWORD}@{DB_HOST}:{DB_PORT}/{DB_NAME}?sslmode=require"

    db_conn_data = {}
    missing_keys = []
    for key in DB_DATA_KEYS:
        if not os.getenv(key):
            missing_keys.append(key)
        else:
            db_conn_data[key] = os.getenv(key)

    if missing_keys:
        raise ValueError(f"Missing environment variables: {missing_keys}")

    db_uri = template_string.format(**db_conn_data)

    db_conn_data["DB_PASSWORD"] = "********"
    print(f"Connecting to {template_string.format(**db_conn_data)}...")

    return db_uri


database_uri = get_database_uri()
engine = create_engine(database_uri)
Base.metadata.create_all(bind=engine)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


def get_db(drop_existing=False):
    database_uri = get_database_uri()
    engine = create_engine(database_uri)
    if drop_existing:
        Base.metadata.drop_all(engine)
    Base.metadata.create_all(bind=engine)

    SessionLocal = sessionmaker(bind=engine)
    return SessionLocal()


def yield_db():
    db_session = SessionLocal()
    try:
        yield db_session
    finally:
        db_session.close()
