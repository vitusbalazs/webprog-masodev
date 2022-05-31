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

export function createAdvertismentsTable() {
    return connectionPool.query('CREATE TABLE IF NOT EXISTS hirdetes (HID INT AUTO_INCREMENT, Cim VARCHAR(50), Telepules VARCHAR(50), Felszinterulet INT, Ar INT, Szobak INT, Datum DATE, FID INT, PRIMARY KEY (HID), FOREIGN KEY (FID) REFERENCES felhasznalo(FID));');
}

export function createUsersTable() {
    return connectionPool.query('CREATE TABLE IF NOT EXISTS felhasznalo (FID INT AUTO_INCREMENT, Nev VARCHAR(50), Jelszo VARCHAR(128), Szerep VARCHAR(30), PRIMARY KEY (FID));');
}

export function createPhotosTable() {
    return connectionPool.query('CREATE TABLE IF NOT EXISTS fenykep (KID INT AUTO_INCREMENT, HID INT, KepPath VARCHAR(300), PRIMARY KEY (KID), FOREIGN KEY (HID) REFERENCES hirdetes(HID));');
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
