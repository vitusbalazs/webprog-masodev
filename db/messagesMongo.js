import { getConnection } from './connectMongo.js';

let connection;

async function getConn() {
    if (!connection) {
        connection = await getConnection();
    }
}

// chat

export async function getMessagesByUsername(username) {
    await getConn();
    const sentMessages = await connection.collection('messages').find({ userSent: username }).toArray();
    const receivedMessages = await connection.collection('messages').find({ userReceived: username }).toArray();

    const messages = sentMessages.concat(receivedMessages);

    messages.sort((a, b) => {
        if (a.date > b.date) {
            return 1;
        }
        if (a.date < b.date) {
            return -1;
        }
        return 0;
    });
    return messages;
}

export async function insertNewMessage(msgData) {
    await getConn();
    await connection.collection('messages').insertOne(msgData);
}
