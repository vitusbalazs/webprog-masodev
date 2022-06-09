import { getConnection } from './connectMongo.js';

let connection;

async function getConn() {
    if (!connection) {
        connection = await getConnection();
    }
}

// index

export async function getUsersIndex() {
    await getConn();
    const indexes = await connection.collection('indexes').findOne();
    return indexes.users;
}

export async function increaseUsersIndex(oldID) {
    await getConn();
    const newIndexCount = oldID + 1;
    await connection.collection('indexes').updateOne({ _id: 0 }, { $set: { users: newIndexCount } });
}

// user

export async function insertUser(userData) {
    await getConn();
    try {
        await connection.collection('users').insertOne(userData);
        await increaseUsersIndex(userData._id);
    } catch (err) {
        console.log(err);
    }
}

export async function getUserFromName(username) {
    await getConn();
    const user = await connection.collection('users').findOne({ username });
    return user;
}

export async function getUserFromID(ID) {
    await getConn();
    let _id;
    if (typeof (ID) === 'string') {
        _id = parseInt(ID, 10);
    } else {
        _id = ID;
    }
    const user = await connection.collection('users').findOne({ _id });
    return user;
}

export async function getUserFromEmail(email) {
    await getConn();
    const user = await connection.collection('users').findOne({ email });
    return user;
}

export async function getAllUsers() {
    await getConn();
    const user = await connection.collection('users').find().toArray();
    return user;
}

export async function validateEmail(verifyToken) {
    await getConn();
    const emailVerify = await connection.collection('users').updateOne({ verifyToken }, { $set: { accountVerified: 1 } });
    return emailVerify;
}

export async function updatePassword(_id, newpw) {
    await getConn();
    const changePassword = await connection.collection('users').updateOne({ _id }, { $set: { password: newpw } });
    return changePassword;
}

export async function updateEmail(_id, email) {
    await getConn();
    const changePassword = await connection.collection('users').updateOne({ _id }, { $set: { email } });
    return changePassword;
}

export async function updatePasswordByToken(verifyToken, newpw) {
    await getConn();
    const changePassword = await connection.collection('users').updateOne({ verifyToken }, { $set: { password: newpw } });
    return changePassword;
}

// admin role

export async function promoteAdminDB(username) {
    await getConn();
    const roleChange = await connection.collection('users').updateOne({ username }, { $set: { role: 'admin' } });
    return roleChange;
}

export async function revokeAdminDB(username) {
    await getConn();
    const roleChange = await connection.collection('users').updateOne({ username }, { $set: { role: 'user' } });
    return roleChange;
}
