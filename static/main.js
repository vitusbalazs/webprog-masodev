function showDetailsBelow(HID) {
    fetch(`/showMiniDetails/${HID}`, {
        method: 'POST',
    }).then((response) => response.text())
        .then((responseText) => {
            const pID = `miniDetails${HID}`;
            document.getElementById(pID).innerText = responseText;
        })
        .catch((error) => {
            const pID = `miniDetails${HID}`;
            document.getElementById(pID).innerText = `Hiba történt: ${error}`;
        });
}

// /ad/deletePhoto/<%= f.KID %>
function deletePhoto(KID, HID) {
    console.log(`${KID} --- ${HID}`);
    fetch(`/ad/deletePhoto/${KID}/${HID}`, {
        method: 'POST',
    }).then((response) => response.text())
        .then((responseText) => {
            console.log(`itt ne, at kene adjam: ${responseText}`);
            document.getElementById('fotok').innerHTML = responseText;
        })
        .catch((error) => {
            console.log(`Error:( ${error}`);
        });
}
