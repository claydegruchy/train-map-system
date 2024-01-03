
import pandas as pd
from sqlalchemy import create_engine
from sqlalchemy.exc import SQLAlchemyError
from sqlalchemy.engine import URL


# Set up SQLite connection
url = URL.create(
    drivername="postgresql",
    username="user",
    password="pw",
    host="localhost",
    port="5432",
    database="gtfs_database",
)

engine = create_engine(url)


try:
    engine.connect()
    print("[database] connection success")
except SQLAlchemyError as err:
    # this will give what kind of error
    print("[database] connection error", err.__cause__)

# exit()
# if main
if __name__ == '__main__':

    # Define GTFS files to import
    gtfs_files = [
        "agency.txt",
        "attributions.txt",
        "stop_times.txt",
        "trips.txt",
        "calendar_dates.txt",
        "calendar.txt",
        "routes.txt",
        "stops.txt",
        "feed_info.txt",
    ]

    # Import GTFS data into the database
    for file in gtfs_files:
        print(f"Importing {file}...")
        df = pd.read_csv(f"./gtfs-data/{file}")
        df.to_sql(file.split(".")[0], engine, if_exists="replace", index=False)
        print(f"{file} imported successfully")

    print("GTFS data imported successfully")
