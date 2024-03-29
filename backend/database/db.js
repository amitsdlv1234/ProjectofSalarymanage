import mysql from 'mysql2/promise';

const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: 'your_MySql_password',
    database: 'your_databseName',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
    supportBigNumbers: true
});


const dbConnection = async () => {
    try {
        const connection = await pool.getConnection();
        console.log("Connected with MySQL");
        return connection;
    } catch (error) {
        console.error('Error connecting to the database:', error);
        throw error;
    }
};

export default dbConnection;
