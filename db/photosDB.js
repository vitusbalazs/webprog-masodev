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

export async function getPhotoNameFromID(photoID) {
    console.log('Szia1');
    const [p] = await connectionPool.execute('SELECT KepPath FROM fenykep WHERE KID=?', [photoID]);
    console.log('Szia2');
    console.log(p[0].KepPath);
    console.log('Szia3');
    return p[0].KepPath;
}
