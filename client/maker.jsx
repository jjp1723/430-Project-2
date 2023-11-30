const helper = require('./helper.js');
const React = require('react');
const ReactDOM = require('react-dom');

const handleMedia = (e) => {
    e.preventDefault();
    helper.hideError();

    const name = e.target.querySelector('#mediaName').value;

    if(!name){
        helper.handleError('Please provide a name for the file');
        return false;
    }

    helper.sendPost(e.target.action, new FormData(e.target), loadMediaFromServer);

    return false;
};

const MediaForm = (props) => {
    return(
        <form id='mediaForm'
            name='mediaForm'
            onSubmit={handleMedia}
            action='/maker'
            method='POST'
            className='mediaForm'>
                
            <label htmlFor='name'>Name: </label>
            <input id='mediaName' type='text' name='name' placeholder='Media Name'/>
            <input type='file' name='uploadFile'/>
            <input className='makeMediaSubmit' type='submit' value='Make Media'/>
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

    const mediaNodes = props.media.map(media => {
        return(
            <div key={media._id} className='media'>
                <h3 className='mediaName' id='mediaName'> Name: {media.name} </h3>
                <h3 className='mediaSize' id='mediaSize'> Size: {media.size} </h3>
                <h3 className='mediaUploaded' id='mediaUploaded'> Date Uploaded: {media.uploadedDate} </h3>
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