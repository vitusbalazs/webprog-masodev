import { getConnection } from './connectMongo.js';

let connection;

async function getConn() {
    if (!connection) {
        connection = await getConnection();
    }
}

// index

export async function getPhotosIndex() {
    await getConn();
    const indexes = await connection.collection('indexes').findOne();
    return indexes.photos;
}

export async function increasePhotosIndex(oldID) {
    await getConn();
    const newIndexCount = oldID + 1;
    await connection.collection('indexes').updateOne({ _id: 0 }, { $set: { photos: newIndexCount } });
}

// photo

export async function insertPhoto(photoData) {
    await getConn();
    try {
        await connection.collection('photos').insertOne(photoData);
        await increasePhotosIndex(photoData._id);
    } catch (err) {
        console.log(err);
    }
}

export async function getPhotosByID(ID) {
    await getConn();
    try {
        const photos = await connection.collection('photos').find({ AdvertisementID: ID }).toArray();
        return photos;
    } catch (err) {
        console.error(err);
        return null;
    }
}

export async function deletePhotoByID(ID) {
    await getConn();
    let _id;
    if (typeof (ID) === 'string') {
        _id = parseInt(ID, 10);
    } else {
        _id = ID;
    }
    const filename = await connection.collection('photos').findOne({ _id });
    await connection.collection('photos').deleteOne({ _id });
    return filename.Path;
}
