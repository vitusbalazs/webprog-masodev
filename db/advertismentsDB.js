import connectionPool from './setupDB.js';

export async function getAllAdvertisments() {
    const [advertisments] = await connectionPool.query('SELECT * FROM advertisments');
    return advertisments;
}

export async function getAdvertismentByID(id) {
    const [advertisment] = await connectionPool.execute('SELECT a.*, u.Name FROM advertisments AS a JOIN users AS u ON a.UserID = u.ID WHERE a.ID=?', [id]);
    return advertisment[0];
}

export async function filterAdvertisments(city, minPrice, maxPrice) {
    const [advertisments] = await connectionPool.execute('SELECT * FROM advertisments WHERE City=? AND Price BETWEEN ? AND ?', [city, minPrice, maxPrice]);
    return advertisments;
}
