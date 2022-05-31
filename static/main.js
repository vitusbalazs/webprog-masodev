function showDetailsBelow(HID) {
    fetch(`/showMiniDetails/${HID}`, {
        method: 'GET',
    }).then((response) => response.text())
        .then((responseText) => {
            const parsed = JSON.parse(responseText);
            if (parsed.err) {
                const pID = `miniDetails${HID}`;
                document.getElementById(pID).innerText = `Hiba történt: ${parsed.err}`;
            } else {
                const respBody = `További információk:
                    Cím: ${parsed.Cim}
                    Település: ${parsed.Telepules}
                    Ár: ${parsed.Ar}
                    Felszínterület: ${parsed.Felszinterulet}
                    Szobák: ${parsed.Szobak}
                    Dátum: ${parsed.Datum}
                    Feltöltötte: ${parsed.Nev}
                `;
                const pID = `miniDetails${HID}`;
                document.getElementById(pID).innerText = respBody;
            }
        })
        .catch((error) => {
            const pID = `miniDetails${HID}`;
            document.getElementById(pID).innerText = `Hiba történt: ${error}`;
        });
}

function deletePhoto(KepID, HirdetesID) {
    fetch(`/deletePhoto/${KepID}/${HirdetesID}`, {
        method: 'DELETE',
    }).then((response) => response.text())
        .then((responseText) => {
            const parsed = JSON.parse(responseText);

            if (parsed.err) {
                document.getElementById('fotok').innerHTML = `<h3>Hiba történt: ${parsed.err}</h3>`;
            } else {
                let respBody = '';
                parsed.forEach((kep) => {
                    respBody += '<div class="fotok-item">';
                    respBody += `<img alt="${kep.KID}" src="${kep.KepPath}">`;
                    respBody += `<button id="${kep.KID}" class="details" onclick="deletePhoto(this.id, ${kep.HID});">Fénykép törlése</button>`;
                    respBody += '</div>';
                });
                respBody += '<h3>A fotó sikeresen törölve lett!</h3>';
                // console.log(`itt ne, at kene adjam: ${responseText}`);
                document.getElementById('fotok').innerHTML = respBody;
            }
        })
        .catch((error) => {
            document.getElementById('fotok').innerHTML = `<h3>Hiba történt: ${error}</h3>`;
        });
}
