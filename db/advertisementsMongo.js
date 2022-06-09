import { getConnection } from './connectMongo.js';

let connection;

async function getConn() {
    if (!connection) {
        connection = await getConnection();
    }
}

// index

export async function getAdvertisementsIndex() {
    await getConn();
    const indexes = await connection.collection('indexes').findOne();
    return indexes.advertisements;
}

export async function increaseAdvertisementsIndex(oldID) {
    await getConn();
    const newIndexCount = oldID + 1;
    await connection.collection('indexes').updateOne({ _id: 0 }, { $set: { advertisements: newIndexCount } });
}

// advertisement

export async function insertAdvertisement(advertisementData) {
    await getConn();
    try {
        await connection.collection('advertisements').insertOne(advertisementData);
        await increaseAdvertisementsIndex(advertisementData._id);
    } catch (err) {
        console.log(err);
    }
}

export async function getAllAdvertisements() {
    await getConn();
    try {
        const advertisements = await connection.collection('advertisements').find().toArray();
        return advertisements;
    } catch (err) {
        console.log(err);
        return null;
    }
}

export async function getAdvertisementByID(ID) {
    await getConn();
    try {
        let _id;
        if (typeof (ID) === 'string') {
            _id = parseInt(ID, 10);
        } else {
            _id = ID;
        }
        const advertisement = await connection.collection('advertisements').findOne({ _id });
        return advertisement;
    } catch (err) {
        console.log(err);
        return null;
    }
}

export async function filterAdvertisements(city, minPrice, maxPrice) {
    await getConn();
    try {
        const advertisements = await getAllAdvertisements();
        const advertisementFiltered = [];
        advertisements.forEach((adv) => {
            if (adv.City === city
                && parseInt(adv.Price, 10) >= parseInt(minPrice, 10)
                && parseInt(adv.Price, 10) <= parseInt(maxPrice, 10)) {
                advertisementFiltered.push(adv);
            }
        });
        return advertisementFiltered;
    } catch (err) {
        console.log(err);
        return null;
    }
}

export async function deleteAdvertisementByID(ID) {
    await getConn();
    let _id;
    if (typeof (ID) === 'string') {
        _id = parseInt(ID, 10);
    } else {
        _id = ID;
    }
    await connection.collection('photos').deleteMany({ AdvertisementID: _id });
    const deleteAdv = connection.collection('advertisements').deleteOne({ _id });
    return deleteAdv;
}
