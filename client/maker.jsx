const helper = require('./helper.js');
const React = require('react');
const ReactDOM = require('react-dom');

// handleMedia Function - Handles submissions from the MediaForm form
const handleMedia = async (e) => {
    e.preventDefault();
    helper.hideError();

    // Getting a reference to the uploaded file, which is required in order to submit the form
    const file = e.target.querySelector('#file');

    // Ensuring the file is an image
    if(!file.files[0].type.includes('image/')){
        helper.handleError('Selected file is not an image!');
        return false;
    }

    // Making a request to the /incStorage url which tests if the uploaded file is small enough to
    //  be stored on the database and adjusts the user's total storage used accordingly
    const response = await fetch('/incStorage', {method: 'POST', headers:{'Content-Type': 'application/json'}, body: JSON.stringify({size: file.files[0].size})});

    // If the uploaded file can be stored, a call is made to the form's action (/maker), which
    //  creates a new media object in the database
    if(response.status === 201)
    {
        const formData = new FormData(e.target);
        helper.sendFile(e.target.action, formData, loadMediaFromServer);
    }

    return false;
};

// MediaForm - Renders a form the user can use to upload image files, with optional descriptions,
//  to the database
const MediaForm = (props) => {
    return(
        <form id='mediaForm'
            name='mediaForm'
            onSubmit={handleMedia}
            action='/maker'
            method='POST'
            encType="multipart/form-data"
            className='mediaForm'
            class='grid-container'>

            <div id='desc'  class='grid-item'>
                <label htmlFor='description'>Description (Optional): </label>
                <input id='mediaDescription' type='text' name='description' placeholder='Image Description'/>
            </div>

            <div id='vis'  class='grid-item'>
                <label htmlFor='visibility'>Visibility: </label>
                <select id='mediaVisibility' type='select' name='visibility'>
                    <option value='private' selected>Private</option>
                    <option value='public'>Public</option>
                </select>
            </div>
            <div id='upFile' class='grid-item'>
                <input id='file' type='file' name='uploadFile' required/>
            </div>
            <div id='upSubmit' class='grid-item'>
                <input className='makeMediaSubmit' type='submit' value='Upload Image'/>
            </div>
        </form>
    );
};

// MediaList - Renders a form which displays all images the user has uploaded with relevent data
const MediaList = (props) => {
    // Creating a string that displays how much storage the user has used our of what is available
    let totalStorage = 16;
    let storageString = '';
    if(props.user){
        if(props.user.premium){
            totalStorage = 256;
        }
        storageString = `Total storage used: ${props.user.storage / 1000000}/ ${totalStorage} Megabytes`
    }

    // If the user hasn't uploaded any files yet, a relevent message is displayed
    if(props.media.length === 0){
        return(
            <div className='mediaList'>
                <h3 className='emptyMedia'>No Images Uploaded Yet!</h3>
            </div>
        );
    }

    // Each file has a visibility field that is assigned to them that the user can toggle between
    //  Public and Private (all are Private by default)
    let visibility;

    // Each file has an uploaded-date and size that needs to be rerendered
    let date;
    let size;
    
    const mediaNodes = props.media.map(media => {
        // Setting visibility based on the file's 'public' boolean value
        if(media.public){
            visibility = 'Public';
        } else {
            visibility = 'Private';
        }

        // Parsing the file's uploaded date and size into a more legible formats
        date = new Date(media.uploadedDate).toDateString();
        size = media.size / 1000000;

        // Creating the datastring used to display each image on the form based on each file's data
        let datastring = `data:${media.mimetype};base64,` + media.data.toString('base64');

        return(
            <div key={media._id} className='media' class='grid-container' id='mediaItem'>
                <h1 className='mediaName' id='mediaName' class='grid-item'> Name: {media.name} </h1>
                <img src={datastring} />
                <h3 className='mediaSize' id='mediaSize' class='grid-item'> Size: {size} Megabytes</h3>
                <h3 className='mediaUploaded' id='mediaUploaded' class='grid-item'> Date Uploaded: {date} </h3>
                <h3 className='mediaDescription' id='mediaDescription' class='grid-item'> Description: {media.description} </h3>
                <h3 className='mediaVisibility' id='mediaVisibility' class='grid-item'> 
                    Visibility: {visibility}&emsp;
                    <button className='toggleVisibility' type='button' value='Toggle Visibility' onClick={() => toggleMediaVisibility(media)}>Toggle Visibility</button>
                </h3>
                <button className='deleteMediaSubmit' type='button' value='Delete Media' onClick={() => deleteMediaFromServer(media)}>DELETE</button>
            </div>
        );
    });

    return(
        <div className='mediaList'>
            <h1>{storageString}</h1>
            {mediaNodes}
        </div>
    );
};

// loadMediaFromServer Function - Loads all of a user's uploaded media and their storage use status
const loadMediaFromServer = async () => {
    const userResponse = await fetch('/getStorage');
    const userData = await userResponse.json();
    const mediaResponse = await fetch('/getMedia');
    const mediaData = await mediaResponse.json();
    ReactDOM.render(<MediaList media={mediaData.media} user={userData.user}/>, document.getElementById('media'));
};

// deleteMediaFromServer Function - Deletes a specific media entry from the database and updates
//  the user's storage use status
const deleteMediaFromServer = async (media) => {
    const deleteResponse = await fetch('/deleteMedia', {method: 'DELETE', headers: {'Content-Type': 'application/json'}, body: JSON.stringify({_id: media._id})});
    if(deleteResponse.status === 201){
        const decResponse = await fetch('/decStorage', {method: 'POST', headers:{'Content-Type': 'application/json'}, body: JSON.stringify({size: media.size})});
        if(decResponse.status === 201) {
            loadMediaFromServer();
        }
    }
}

// toggleMediaVisibilityFunction - Toggles whether a specific media entry is visible
//  on the Explore page
const toggleMediaVisibility = async (media) => {
    const response = await fetch('/toggleMedia', {method: 'POST', headers:{'Content-Type': 'application/json'}, body: JSON.stringify({_id: media._id, public: media.public})});
    if(response.status === 201){
        loadMediaFromServer();
    }
};

// init Function - Renders the MediaForm and MediaList forms automatically, then calls the
//  loadMediaFromServer function to populate the MediaList form
const init = () => {
    ReactDOM.render(<MediaForm/>, document.getElementById('makeMedia'));
    ReactDOM.render(<MediaList media={[]}/>, document.getElementById('media'));

    loadMediaFromServer();
};

window.onload = init;