import mysql2 from 'mysql2/promise.js';

const connectionPool = mysql2.createPool({
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: 'root',
    database: 'Lakashirdetesek',
    connectionLimit: 5,
});

export default connectionPool;

export function createAdvertisementsTable() {
    return connectionPool.query('CREATE TABLE IF NOT EXISTS advertisements (ID INT AUTO_INCREMENT, UserID INT, Address TEXT, City TEXT, Surface INT, Price INT, Rooms INT, Date DATE, PRIMARY KEY (ID), FOREIGN KEY (UserID) REFERENCES users(ID));');
}

export function createUsersTable() {
    return connectionPool.query('CREATE TABLE IF NOT EXISTS felhasznalo (FID INT AUTO_INCREMENT, Nev VARCHAR(50), Jelszo VARCHAR(128), Szerep VARCHAR(30), PRIMARY KEY (FID));');
}

export function createPhotosTable() {
    return connectionPool.query('CREATE TABLE IF NOT EXISTS photos (ID INT AUTO_INCREMENT, AdvertisementID INT, Path TEXT, PRIMARY KEY (ID), FOREIGN KEY (AdvertisementID) REFERENCES advertisements(ID));');
}

export function createTables() {
    createUsersTable()
        .then(createAdvertisementsTable)
        .then(createPhotosTable)
        .then(() => {
            console.log('Database ready, tables created if they were non-existent');
        })
        .catch((err) => {
            console.error(err);
        });
}
