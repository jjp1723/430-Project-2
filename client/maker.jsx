const helper = require('./helper.js');
const React = require('react');
const ReactDOM = require('react-dom');

// handleMedia Function - Handles submissions from the MediaForm form
const handleMedia = async (e) => {
    e.preventDefault();
    helper.hideError();

    // Getting a reference to the uploaded file, which is required in order to submit the form
    const file = e.target.querySelector('#file');

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
            className='mediaForm'>

            <div id='imageParams'>
                <label htmlFor='description'>Description (Optional): </label>
                <input id='mediaDescription' type='text' name='description' placeholder='Media Description'/>
                <label htmlFor='visibility'>Visibility: </label>
                <select id='mediaVisibility' type='select' name='visibility'>
                    <option value='private' selected>Private</option>
                    <option value='public'>Public</option>
                </select>
            </div>
            <div id='imageUpload'>
                <input id='file' type='file' name='uploadFile' required/>
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
                <h3 className='emptyMedia'>No Media Yet!</h3>
            </div>
        );
    }

    // Each file has a visibility field that is assigned to them that the user can toggle between
    //  Public and Private (all are Private by default)
    let visibility;
    const mediaNodes = props.media.map(media => {
        if(media.public){
            visibility = 'Public';
        } else {
            visibility = 'Private';
        }

        // Creating the datastring used to display each image on the form based on each file's data
        let datastring = `data:${media.mimetype};base64,` + media.data.toString('base64');

        return(
            <div key={media._id} className='media'>
                <img src={datastring} />
                <h3 className='mediaName' id='mediaName'> Name: {media.name} </h3>
                <h3 className='mediaSize' id='mediaSize'> Size: {media.size} Bytes</h3>
                <h3 className='mediaUploaded' id='mediaUploaded'> Date Uploaded: {media.uploadedDate} </h3>
                <h3 className='mediaDescription' id='mediaDescription'> Description: {media.description} </h3>
                <h3 className='mediaVisibility' id='mediaVisibility'> 
                    Visibility: {visibility}
                    <button className='toggleVisibility' type='button' value='Toggle Visibility' onClick={() => toggleMediaVisibility(media)}>Toggle Visibility</button>
                </h3>
                <button className='deleteMediaSubmit' type='button' value='Delete Media' onClick={() => deleteMediaFromServer(media)}>X</button>
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