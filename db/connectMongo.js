import { MongoClient } from 'mongodb';

let connection;

const url = 'mongodb+srv://vitusbalazs:lollop111@homeads.3uwdlat.mongodb.net/?retryWrites=true&w=majority';
const dbName = 'HomeAds';

export async function connectDB() {
    try {
        connection = await MongoClient.connect(url);
        connection = connection.db(dbName);

        console.log('Database connected.');
    } catch (err) {
        console.error('MongoDB connect error');
    }
}

// index

export async function getUsersIndex() {
    const indexes = await connection.collection('indexes').findOne();
    return indexes.users;
}

export async function increaseUsersIndex(oldID) {
    const newIndexCount = oldID + 1;
    await connection.collection('indexes').updateOne({ _id: 0 }, { $set: { users: newIndexCount } });
}

export async function getAdvertisementsIndex() {
    const indexes = await connection.collection('indexes').findOne();
    return indexes.advertisements;
}

export async function increaseAdvertisementsIndex(oldID) {
    const newIndexCount = oldID + 1;
    await connection.collection('indexes').updateOne({ _id: 0 }, { $set: { advertisements: newIndexCount } });
}

export async function getPhotosIndex() {
    const indexes = await connection.collection('indexes').findOne();
    return indexes.photos;
}

export async function increasePhotosIndex(oldID) {
    const newIndexCount = oldID + 1;
    await connection.collection('indexes').updateOne({ _id: 0 }, { $set: { photos: newIndexCount } });
}

// advertisement

export async function insertAdvertisement(advertisementData) {
    try {
        await connection.collection('advertisements').insertOne(advertisementData);
        await increaseAdvertisementsIndex(advertisementData._id);
    } catch (err) {
        console.log(err);
    }
}

export async function getAllAdvertisements() {
    try {
        const advertisements = await connection.collection('advertisements').find().toArray();
        return advertisements;
    } catch (err) {
        console.log(err);
        return null;
    }
}

export async function getAdvertisementByID(ID) {
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

// photo

export async function insertPhoto(photoData) {
    try {
        await connection.collection('photos').insertOne(photoData);
        await increasePhotosIndex(photoData._id);
    } catch (err) {
        console.log(err);
    }
}

export async function getPhotosByID(ID) {
    try {
        const photos = await connection.collection('photos').find({ AdvertisementID: ID }).toArray();
        return photos;
    } catch (err) {
        console.error(err);
        return null;
    }
}

// user

export async function insertUser(userData) {
    try {
        await connection.collection('users').insertOne(userData);
        await increaseUsersIndex(userData._id);
    } catch (err) {
        console.log(err);
    }
}

export async function getUserFromName(username) {
    const user = await connection.collection('users').findOne({ username });
    return user;
}

export async function getUserFromID(ID) {
    let _id;
    if (typeof (ID) === 'string') {
        _id = parseInt(ID, 10);
    } else {
        _id = ID;
    }
    const user = await connection.collection('users').findOne({ _id });
    return user;
}
