const helper = require('./helper.js');
const React = require('react');
const ReactDOM = require('react-dom');

const handleMedia = (e) => {
    e.preventDefault();
    helper.hideError();

    helper.sendFile(e.target.action, new FormData(e.target), loadMediaFromServer);

    return false;
};

const MediaForm = (props) => {
    return(
        <form id='mediaForm'
            name='mediaForm'
            onSubmit={handleMedia}
            action='/maker'
            method='POST'
            encType="multipart/form-data"
            className='mediaForm'>
                
            <input type='file' name='uploadFile'/>
            <label htmlFor='description'>Description (Optional): </label>
            <input id='mediaDescription' type='text' name='description' placeholder='Media Description'/>
            <label htmlFor='visibility'>Visibility: </label>
            <select id='mediaVisibility' type='select' name='visibility'>
                <option value='private' selected>Private</option>
                <option value='public'>Public</option>
            </select>
            <input className='makeMediaSubmit' type='submit' value='Upload Image'/>
        </form>
    );
};

const MediaList = (props) => {
    if(props.media.length === 0){
        return(
            <div className='mediaList'>
                <h3 className='emptyMedia'>No Media Yet!</h3>
            </div>
        );
    }

    let visibility;

    const mediaNodes = props.media.map(media => {
        if(media.public){
            visibility = 'Public';
        } else {
            visibility = 'Private';
        }

        return(
            <div key={media._id} className='media'>
                <h3 className='mediaName' id='mediaName'> Name: {media.name} </h3>
                <h3 className='mediaSize' id='mediaSize'> Size: {media.size} Bytes</h3>
                <h3 className='mediaUploaded' id='mediaUploaded'> Date Uploaded: {media.uploadedDate} </h3>
                <h3 className='mediaDescription' id='mediaDescription'> Description: {media.description} </h3>
                <h3 className='mediaVisibility' id='mediaVisibility'> Visibility: {visibility} </h3>
                <button className='deleteMediaSubmit' type='button' value='Delete Media' onClick={() => deleteMediaFromServer(media)}>X</button>
            </div>
        );
    });

    return(
        <div className='mediaList'>
            {mediaNodes}
        </div>
    );
};

// loadMediaFromServer Function - Loads all of a user's uploaded media
const loadMediaFromServer = async () => {
    const response = await fetch('/getMedia');
    const data = await response.json();
    ReactDOM.render(<MediaList media={data.media}/>, document.getElementById('media'));
};

// deleteMediaFromServer Function - Deletes a specific media entry from the database
const deleteMediaFromServer = async (media) => {
    const response = await fetch('/deleteMedia', {method: 'DELETE', headers: {'Content-Type': 'application/json'}, body: JSON.stringify(media)});
    if(response.status === 201){
        loadMediaFromServer();
    }
}

// To-Do: Create a function to be called from a specific entry akin to deleteMediaFromServer
//  which allows users to toggle whether their media will be publically viewable in the explore tab

// const toggleMediaPublic = async (media) => {

// };

const init = () => {
    ReactDOM.render(<MediaForm/>, document.getElementById('makeMedia'));

    ReactDOM.render(<MediaList media={[]}/>, document.getElementById('media'));

    loadMediaFromServer();
};

window.onload = init;