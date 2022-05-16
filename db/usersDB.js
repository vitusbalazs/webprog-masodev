import connectionPool from './setupDB.js';

export function insertUser(nev, jelszo) {
    return connectionPool.execute('INSERT INTO felhasznalo VALUES (default, ?, ?)', [nev, jelszo]);
}

export async function userExists(username) {
    const a = await connectionPool.execute('SELECT * FROM felhasznalo WHERE Nev=?', [username]);
    if (a[0].length > 0) {
        return true;
    }
    return false;
}

export async function getUsers() {
    const [u] = await connectionPool.query('SELECT * FROM felhasznalo');
    return u;
}
