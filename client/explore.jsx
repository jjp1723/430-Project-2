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
                <h3 className='emptyMedia'>No Media Yet!</h3>
            </div>
        );
    }

    let datastring;

    let owners = [];
    props.users.map(user => {
        owners[user._id] = user.username;
    });

    const mediaNodes = props.media.map(media => {
        datastring = `data:${media.mimetype};base64,` + media.data.toString('base64');

        return(
            <div key={media._id} className='media'>
                <img src={datastring} />
                <h3 className='mediaOwner' id='mediaOwner'> Uploader: {owners[media.owner]} </h3>
                <h3 className='mediaName' id='mediaName'> Name: {media.name} </h3>
                <h3 className='mediaUploaded' id='mediaUploaded'> Date Uploaded: {media.uploadedDate} </h3>
                <h3 className='mediaDescription' id='mediaDescription'> Description: {media.description} </h3>
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