// ----- explore.jsx -----
// Handles rendering react components on the explore page

// const helper = require('./helper.js');
const React = require('react');
const ReactDOM = require('react-dom');

// ExploreList - Renders the media uploaded by all current users
const ExploreList = (props) => {
    if(props.media.length === 0){
        return(
            <div className='mediaList'>
                <h3 className='emptyMedia'>No Images Uploaded Yet!</h3>
            </div>
        );
    }

    // dataString will be used to store the data property of the media to be displayed
    let datastring;

    // Creating a list of all users registered with the site
    let owners = [];
    props.users.map(user => {
        owners[user._id] = user.username;
    });

    // Generating each 'media' node to be displayed in the form
    const mediaNodes = props.media.map(media => {
        datastring = `data:${media.mimetype};base64,` + media.data.toString('base64');

        return(
            <div key={media._id} className='media' class='grid-container' id='mediaItem'>
                <h1 className='mediaName' id='mediaName' class='grid-item'> Name: {media.name} </h1>
                <img src={datastring}  class='grid-item'/>
                <h3 className='mediaOwner' id='mediaOwner' class='grid-item'> Uploader: {owners[media.owner]} </h3>
                <h3 className='mediaUploaded' id='mediaUploaded' class='grid-item'> Date Uploaded: {media.uploadedDate} </h3>
                <h3 className='mediaDescription' id='mediaDescription' class='grid-item'> Description: {media.description} </h3>
            </div>
        );
    });

    return(
        <div className='mediaList'>
            {mediaNodes}
        </div>
    );
};

// loadMediaFromServer function - Loads all public media from the server as well as account usernames
const loadMediaFromServer = async () => {
    const mediaResponse = await fetch('/getPublic');
    const mediaData = await mediaResponse.json();
    const accountResponse = await fetch('/getUsers');
    const accountData = await accountResponse.json();
    ReactDOM.render(<ExploreList media={mediaData.media} users={accountData.users}/>, document.getElementById('explore'));
};

const init = () => {
    ReactDOM.render(<ExploreList media={[]}/>, document.getElementById('explore'));

    loadMediaFromServer();
};

window.onload = init;