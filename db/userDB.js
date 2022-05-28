import connectionPool from './setupDB.js';

export async function insertUser(username, password) {
    return connectionPool.execute('INSERT INTO users VALUES (default, ?, ?, \'user\')', [username, password]);
}

export async function getUser(userID) {
    const [user] = connectionPool.execute('SELECT * FROM users WHERE ID=?', [userID]);
    return user[0];
}

export async function userExists(username) {
    const [user] = await connectionPool.execute('SELECT * FROM users WHERE Name=?', [username]);
    if (user.length > 0) {
        return true;
    }
    return false;
}
