import connectionPool from './setupDB.js';

export function insertAdvertisment(cim, telepules, felszin, ar, szobak, datum, user) {
    return connectionPool.query('INSERT INTO hirdetes VALUES (default, ?, ?, ?, ?, ?, ?, ?)', [cim, telepules, felszin, ar, szobak, datum, user]);
}

export async function getAdvertisments(filter, telepules, minAr, maxAr) {
    if (filter) {
        const [h] = await connectionPool.query('SELECT * FROM hirdetes WHERE Telepules=? AND Ar>=? AND Ar<=?', [telepules, minAr, maxAr]);
        return h;
    }
    const [h] = await connectionPool.query('SELECT * FROM hirdetes');
    return h;
}

export async function getDetails(advID) {
    const [d] = await connectionPool.query('SELECT h.*, f.Nev FROM hirdetes AS h JOIN felhasznalo AS f ON h.FID = f.FID WHERE HID=?', [advID]);
    return d;
}
