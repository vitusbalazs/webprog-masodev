import mysql2 from 'mysql2/promise.js';

const connectionPool = mysql2.createPool({
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: 'root',
    database: 'HomeAds',
    connectionLimit: 5,
});

export default connectionPool;

export function createAdvertismentsTable() {
    return connectionPool.query('CREATE TABLE IF NOT EXISTS advertisments (ID INT AUTO_INCREMENT, UserID INT, Address TEXT, City TEXT, Surface INT, Price INT, Rooms INT, Date DATE, PRIMARY KEY (ID), FOREIGN KEY (UserID) REFERENCES users(ID));');
}

export function createUsersTable() {
    return connectionPool.query('CREATE TABLE IF NOT EXISTS users (ID INT AUTO_INCREMENT, Name TEXT, Password TEXT, Role TEXT, PRIMARY KEY (ID));');
}

export function createPhotosTable() {
    return connectionPool.query('CREATE TABLE IF NOT EXISTS photos (ID INT AUTO_INCREMENT, AdvertismentID INT, Path TEXT, PRIMARY KEY (ID), FOREIGN KEY (AdvertismentID) REFERENCES advertisments(ID));');
}

export function createTables() {
    createUsersTable()
        .then(createAdvertismentsTable)
        .then(createPhotosTable)
        .then(() => {
            console.log('Database ready, tables created if they were non-existent');
        })
        .catch((err) => {
            console.error(err);
        });
}
