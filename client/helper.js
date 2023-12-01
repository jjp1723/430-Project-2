const handleError = (message) => {
    document.getElementById('errorMessage').textContent = message;
    document.getElementById('mediaMessage').classList.remove('hidden');
  };
  
/* Sends post requests to the server using fetch. Will look for various
    entries in the response JSON object, and will handle them appropriately.
*/
const sendPost = async (url, data, handler) => {
    const response = await fetch(url, {
        method: 'POST',
        headers: {
        'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    });

    const result = await response.json();
    document.getElementById('mediaMessage').classList.add('hidden');

    if(result.redirect) {
        window.location = result.redirect;
    }

    if(result.error) {
        handleError(result.error);
    }

    if(handler){
        handler(result);
    }
};

const sendFile = async (url, data, handler) => {
    const response = await fetch(url, {
        method: 'POST',
        body: data,
    });

    const result = await response.json();
    document.getElementById('mediaMessage').classList.add('hidden');

    if(result.redirect) {
        window.location = result.redirect;
    }

    if(result.error) {
        handleError(result.error);
    }

    if(handler){
        handler(result);
    }
};

const hideError = () => {
    document.getElementById('mediaMessage').classList.add('hidden');
};

module.exports = {
    handleError,
    sendPost,
    sendFile,
    hideError,
};