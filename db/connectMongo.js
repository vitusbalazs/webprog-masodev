import { MongoClient } from 'mongodb';

let connection;

const url = 'mongodb+srv://vitusbalazs:lollop111@homeads.3uwdlat.mongodb.net/?retryWrites=true&w=majority';
const dbName = 'HomeAds';

export async function connectDB() {
    try {
        connection = await MongoClient.connect(url);
        connection = connection.db(dbName);

        console.log('Database connected.');
        return true;
    } catch (err) {
        console.error(`MongoDB connect error ${err}`);
        return false;
    }
}

export async function getConnection() {
    await connectDB();
    return connection;
}
