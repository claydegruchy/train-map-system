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

```
select stop_id from stop_times where trip_id=1001760 limit 10


with recursive tree as (
  select node, parent, length, stop_id as root_id
  from stop_times
  where parent is null
  union all
  select c.node, c.parent, c.length, p.root_id
  from network c
    join tree p on p.node = c.parent
)
select root_id, array_agg(node) as edges_in_group, sum(length) as total_length
from tree
group by root_id;
```

select stop_id from stop_times where trip_id=1001760 limit 10
