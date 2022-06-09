let refreshTimeout = null;

// -------------------------------- display details in list --------------------------------

function getDetailsList(id) {
    fetch(`/advertisement/getMiniDetails/${id}`, {
        method: 'GET',
    })
        .then((response) => response.text())
        .then((responseStatus) => {
            const respJSON = JSON.parse(responseStatus);
            if (respJSON) {
                const parent = document.getElementById(`listDetails${parseInt(id, 10)}`);

                while (parent.firstChild) {
                    parent.removeChild(parent.firstChild);
                }

                let para = document.createElement('p');
                let node = document.createTextNode(`Number of rooms: ${respJSON.Rooms}`);
                para.appendChild(node);
                parent.appendChild(para);

                para = document.createElement('p');
                node = document.createTextNode(`Surface area: ${respJSON.Surface} m²`);
                para.appendChild(node);
                parent.appendChild(para);

                para = document.createElement('p');
                node = document.createTextNode(`Date: ${respJSON.Date}`);
                para.appendChild(node);
                parent.appendChild(para);
            }
        })
        .catch((err) => {
            document.getElementById(`miniDetailsError${parseInt(id, 10)}`).innerText = `There was an error while deleting the photo. ${err}`;
        });
}

// -------------------------------- photo manipulation --------------------------------

function deletePhoto(id) {
    fetch(`/advertisement/deletePhoto/${id}`, {
        method: 'DELETE',
    })
        .then((response) => response.status)
        .then((responseStatus) => {
            if (responseStatus === 200) {
                document.getElementById(`photo${id}`).remove();
            } else {
                document.getElementById('photoDeleteError').innerText = 'There was an error while deleting the photo.';
            }
        })
        .catch((err) => {
            document.getElementById('photoDeleteError').innerText = `There was an error while deleting the photo. ${err}`;
        });
}

// -------------------------------- message manipulation functions --------------------------------

function getMessages(name, role) {
    if (refreshTimeout) {
        clearTimeout(refreshTimeout);
    }
    const target = document.getElementById('peopleSelect').value;
    fetch(`/chat/getMessages?source=${name}&target=${target}`, {
        method: 'GET',
    })
        .then((response) => response.text())
        .then((responseText) => {
            document.getElementById('sendMessageButton').disabled = false;
            if (role === 'admin') {
                document.getElementById('promote').disabled = false;
                document.getElementById('revoke').disabled = false;
            }
            const responseJSON = JSON.parse(responseText);
            const ulElement = document.getElementById('messages');
            while (ulElement.firstChild) {
                ulElement.removeChild(ulElement.firstChild);
            }

            responseJSON.forEach((resp) => {
                const messageListItem = document.createElement('li');
                messageListItem.classList.add('list-group-item');
                if (resp.userSent === name) {
                    messageListItem.classList.add('list-group-item-dark');
                    const messageInfo = `You sent this message to ${resp.userReceived}`;
                    messageListItem.innerText = `${messageInfo}\n${resp.message}`;
                    ulElement.appendChild(messageListItem);
                } else {
                    const messageInfo = `${resp.userSent} sent you this message`;
                    messageListItem.innerText = `${messageInfo}\n${resp.message}`;
                    ulElement.appendChild(messageListItem);
                }
            });
            refreshTimeout = setTimeout(getMessages(name), 1000);
        })
        .catch((err) => {
            console.log(err);
        });
}

function sendMessage(e, source) {
    e.preventDefault();
    const message = document.getElementById('smMessage').value;
    const target = document.getElementById('peopleSelect').value;

    document.getElementById('smMessage').value = '';

    fetch(`/chat/sendMessage?source=${source}&target=${target}&message=${message}`, {
        method: 'POST',
    }).catch((err) => {
        console.log(err);
    });
}

// -------------------------------- user role manipulation --------------------------------

function promoteAdmin() {
    const target = document.getElementById('peopleSelect').value;
    fetch(`/user/setAdminStatus?user=${target}&newRole=admin`, {
        method: 'POST',
    }).catch((err) => {
        console.log(err);
    });
}

function revokeAdmin() {
    const target = document.getElementById('peopleSelect').value;
    fetch(`/user/setAdminStatus?user=${target}&newRole=user`, {
        method: 'POST',
    }).catch((err) => {
        console.log(err);
    });
}

// -------------------------------- google maps api --------------------------------
function loadMap() {
    const attribution = new ol.control.Attribution({
        collapsible: false,
    });

    const map = new ol.Map({
        controls: ol.control.defaults({ attribution: false }).extend([attribution]),
        layers: [
            new ol.layer.Tile({
                source: new ol.source.OSM({
                    url: 'https://tile.openstreetmap.be/osmbe/{z}/{x}/{y}.png',
                }),
            }),
        ],
        target: 'map',
        view: new ol.View({
            center: ol.proj.fromLonLat([4.35247, 50.84673]),
            minZoom: 16,
            maxZoom: 18,
            zoom: 17,
        }),
    });
}
