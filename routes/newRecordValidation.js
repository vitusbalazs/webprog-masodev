export function validateDate(date1, date2) {
    if (date1.getMonth() === date2.getMonth() && date1.getDate() === date2.getDate()) {
        if (date1.getFullYear() === date2.getFullYear()) {
            return true;
        }
    }
    return false;
}

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
