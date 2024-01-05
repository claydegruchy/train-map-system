When I was travelling in germany, I got really heated about the fact that DB wants every micron of information from you BEFORE giving you any view of what options you may have to travel. This goal of this is to make it easier to get a rough idea of what travel is possible before needing to commit your leave time, arrival time, fucking age, shoe size, or sperm count.


# starting this

# from scratch:
in `database/`
1. download the `gdfs-data.zip` from https://gtfs.de/en/feeds/
2. extract `gdfs-data.zip` to `gdfs-data/`
3. run `docker-compose up` to spin up postgresql
4. run `database_import.py` to import data into the db (takes ages)
5. take a backup with `pg_dump -h localhost -U user -d gtfs_database > gtfs_database.backup`

# from backup
load a backup with `psql -h localhost -U user -d gtfs_database < gtfs_database.backup`


# notes
this should be remade to use `opentripplanner`

# dumping ground
pg_dump -h localhost -U user -d gtfs_database > gtfs_database.backup
psql -h localhost -U user -d gtfs_database
pg_dump

pg_dump -h localhost -U user -d gtfs_database > gtfs_database.backup

psql -h localhost -U user -d gtfs_database < gtfs_database.backup



select stop_id from stop_times where trip_id=1001760 limit 10

get stops of route
```
SELECT stops.stop_name,stops.stop_lat, stops.stop_lon  
FROM stops
JOIN stop_times ON stops.stop_id = stop_times.stop_id
JOIN trips ON stop_times.trip_id = trips.trip_id
JOIN routes ON trips.route_id = routes.route_id
WHERE routes.route_id = 16709;
```

```
SELECT routes.route_id, routes.route_long_name, routes.route_short_name
FROM routes
JOIN trips ON routes.route_id = trips.route_id
JOIN (
    SELECT trip_id,
           MIN(departure_time) AS first_stop_time,
           MAX(departure_time) AS last_stop_time
    FROM stop_times
    GROUP BY trip_id
) AS stop_time_summary ON trips.trip_id = stop_time_summary.trip_id
WHERE TIME_TO_SEC(last_stop_time) - TIME_TO_SEC(first_stop_time) > 6 * 3600 LIMIT 10
```

