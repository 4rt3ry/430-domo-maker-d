/* Takes in an error message. Sets the error message up in html, and
   displays it to the user. Will be hidden by other events that could
   end in an error.
*/
const handleError = (message) => {
    document.getElementById('errorMessage').textContent = message;
    document.getElementById('domoMessage').classList.remove('hidden');
};

/**
 * Hide the error popup
 */
const hideError = () => {
    document.getElementById('domoMessage').classList.add('hidden');
}

const send = async (url, data, handler, method) => {
    const response = await fetch(url, {
        method: method,
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    });

    const result = await response.json();
    document.getElementById('domoMessage').classList.add('hidden');

    if (result.redirect) {
        window.location = result.redirect;
    }

    if (result.error) {
        handleError(result.error);
    }

    if (handler) {
        handler(result);
    }
}

/* Sends post requests to the server using fetch. Will look for various
   entries in the response JSON object, and will handle them appropriately.
*/
const sendPost = async (url, data, handler) => {
    send(url, data, handler, 'POST');
};

const sendDelete = async (url, data, handler) => {
    send(url, data, handler, 'DELETE');
}

module.exports = {
    handleError,
    sendPost,
    sendDelete,
    hideError
}