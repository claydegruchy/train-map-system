import pg from 'pg';
// const pool = new pg.Pool()
/**
 * Create a new connection pool to the database.
 */
const pool = new pg.Pool({
    database: "gtfs_database",
    user: "user",
    password: "pw",
    host: "localhost",
    port: 5432,
});

/**
 * Connect to the PostgreSQL database.
 */


export const makeQuery = async (query, params) => {

    const client = await pool.connect();
    try {
        const { rows } = await client.query(query, params);
        return rows;
    } catch (error) {
        console.error(error);
    } finally {
        client.release();
    }
}
