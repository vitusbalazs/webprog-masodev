import connectionPool from './setupDB.js';

export function insertPhoto(advID, photoPath) {
    return connectionPool.query('INSERT INTO fenykep VALUES (default, ?, ?)', [advID, photoPath]);
}

export async function getPhotos(advID) {
    const [p] = await connectionPool.query('SELECT * FROM fenykep WHERE HID=?', [advID]);
    return p;
}
