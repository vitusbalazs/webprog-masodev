export function validateNew(cim, telepules, felszin, ar, szobak) {
    if (cim.length < 3) {
        return false;
    }
    if (telepules.length < 3) {
        return false;
    }
    if (felszin <= 0) {
        return false;
    }
    if (ar < 0) {
        return false;
    }
    if (szobak <= 0) {
        return false;
    }
    return true;
}

export function validateLength(cim, telepules) { // complexity miatt
    if (cim.length < 3 || telepules.length < 3) {
        return false;
    }
    return true;
}
