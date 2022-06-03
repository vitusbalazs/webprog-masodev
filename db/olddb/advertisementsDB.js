import connectionPool from './setupDB.js';

export async function getAllAdvertisements() {
    const [advertisements] = await connectionPool.query('SELECT * FROM advertisements');
    return advertisements;
}

export async function getAdvertisementByID(id) {
    const [advertisement] = await connectionPool.execute('SELECT a.*, u.Name FROM advertisements AS a JOIN users AS u ON a.UserID = u.ID WHERE a.ID=?', [id]);
    return advertisement[0];
}

export async function filterAdvertisements(city, minPrice, maxPrice) {
    const [advertisements] = await connectionPool.execute('SELECT * FROM advertisements WHERE City=? AND Price BETWEEN ? AND ?', [city, minPrice, maxPrice]);
    return advertisements;
}

export async function insertPhoto(ID, photoPath) {
    const [photoDone] = await connectionPool.execute('INSERT INTO photos VALUES (default, ?, ?)', [ID, photoPath]);
    return photoDone;
}

export async function getPhotosByID(ID) {
    const [photos] = await connectionPool.execute('SELECT * FROM photos WHERE AdvertisementID=?', [ID]);
    return photos;
}
