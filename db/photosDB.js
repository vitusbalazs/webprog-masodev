import connectionPool from './setupDB.js';

export function insertPhoto(advID, photoPath) {
    return connectionPool.execute('INSERT INTO fenykep VALUES (default, ?, ?)', [advID, photoPath]);
}

export async function getPhotos(advID) {
    const [p] = await connectionPool.execute('SELECT * FROM fenykep WHERE HID=?', [advID]);
    return p;
}

export function deletePhoto(photoID) {
    return connectionPool.execute('DELETE FROM fenykep WHERE KID=?', [photoID]);
}
