from database import database_import
from sqlalchemy import text, inspect
from sqlalchemy.orm import sessionmaker


engine = database_import.engine


Session = sessionmaker(bind=engine)
session = Session()

insp = inspect(engine)
print(insp.get_table_names())
exit()


# if main
if __name__ == '__main__':
    print("starting...")

    sql_query = text("""
        SELECT *
        FROM agency
        LIMIT 10
    """)
    result = session.execute(sql_query)
    agency = result.fetchall()
    print(agency)
    route_id = 'your_desired_route_id'

    # Define the SQL query using SQLAlchemy's text function
    sql_query = text("""
        SELECT stops.*
        FROM routes
        JOIN trips ON routes.route_id = trips.route_id
        JOIN stop_times ON trips.trip_id = stop_times.trip_id
        JOIN stops ON stop_times.stop_id = stops.stop_id
        WHERE routes.route_id = :route_id
    """)

    # Execute the query with the provided parameters
    result = session.execute(sql_query, {'route_id': route_id})

    # Fetch all the results
    stops_on_route = result.fetchall()
    # Print or process the results
    for stop in stops_on_route:
        print(stop)

database_import.close()
