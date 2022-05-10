import mysql2 from 'mysql2/promise.js';

const connectionPool = mysql2.createPool({
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: 'root',
    database: 'Lakashirdetesek',
    connectionLimit: 5,
});

export default function getConnection() {
    return connectionPool;
}

export function createTable1() {
    return connectionPool.query('CREATE TABLE IF NOT EXISTS hirdetes (HID INT AUTO_INCREMENT, Cim VARCHAR(50), Telepules VARCHAR(50), Felszinterulet INT, Ar INT, Szobak INT, Datum DATE, FID INT, PRIMARY KEY (HID), FOREIGN KEY (FID) REFERENCES felhasznalo(FID));');
}

export function createTable2() {
    return connectionPool.query('CREATE TABLE IF NOT EXISTS felhasznalo (FID INT AUTO_INCREMENT, Nev VARCHAR(50), Jelszo VARCHAR(50), PRIMARY KEY (FID));');
}

export function createTable3() {
    return connectionPool.query('CREATE TABLE IF NOT EXISTS fenykep (KID INT AUTO_INCREMENT, HID INT, KepPath VARCHAR(300), PRIMARY KEY (KID), FOREIGN KEY (HID) REFERENCES hirdetes(HID));');
}

export function insertAdvertisment(cim, telepules, felszin, ar, szobak, datum, user) {
    return connectionPool.query('INSERT INTO hirdetes VALUES (default, ?, ?, ?, ?, ?, ?, ?)', [cim, telepules, felszin, ar, szobak, datum, user]);
}

export function insertUser(nev, jelszo) {
    return connectionPool.query('INSERT INTO felhasznalo VALUES (default, ?, ?)', [nev, jelszo]);
}

export function insertPhoto(advID, photoPath) {
    return connectionPool.query('INSERT INTO fenykep VALUES (default, ?, ?)', [advID, photoPath]);
}

export function getAdvertisments(filter, telepules, minAr, maxAr) {
    if (filter) {
        return connectionPool.query('SELECT * FROM hirdetes WHERE Telepules=? AND Ar>=? AND Ar<=?', [telepules, minAr, maxAr]);
    }
    return connectionPool.query('SELECT * FROM hirdetes');
}

export function getUsers() {
    return connectionPool.query('SELECT * FROM felhasznalo');
}

export async function userExists(username) {
    const a = await connectionPool.query('SELECT * FROM felhasznalo WHERE Nev=?', [username]);
    if (a[0].length > 0) {
        return true;
    }
    return false;
}

export function getPhotos(advID) {
    return connectionPool.query('SELECT * FROM fenykep WHERE HID=?', [advID]);
}

export function getDetails(advID) {
    return connectionPool.query('SELECT h.*, f.Nev FROM hirdetes AS h JOIN felhasznalo AS f ON h.FID = f.FID WHERE HID=?', [advID]);
}

createTable2()
    .then(createTable1)
    .then(createTable3)
    .catch((err) => {
        console.error(err);
    })
    .then((result) => {
        console.log(`Databases ready: ${result}`);
    });