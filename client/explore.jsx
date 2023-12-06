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

    const mediaNodes = props.media.map(media => {
        let datastring = `data:${media.mimetype};base64,` + media.data.toString('base64');

        return(
            <div key={media._id} className='media'>
                <img src={datastring} />
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

// To-Do: Replace loadMediaFromServer Function with a function that makes a fetch request to
//  ALL media currently in the database
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