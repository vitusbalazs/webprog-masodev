import connectionPool from './setupDB.js';

export async function getAllAdvertisments() {
    const [advertisments] = await connectionPool.query('SELECT * FROM advertisments');
    return advertisments;
}

export async function getAdvertismentByID(id) {
    const [advertisment] = await connectionPool.execute('SELECT * FROM advertisments WHERE ID=?', [id]);
    return advertisment[0];
}

export async function filterAdvertisments(city, minPrice, maxPrice) {
    const [advertisments] = await connectionPool.execute('SELECT * FROM advertisments WHERE City=? AND Price BETWEEN ? AND ?', [city, minPrice, maxPrice]);
    console.log(advertisments);
    return advertisments;
}
