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
