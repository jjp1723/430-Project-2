// ----- explore.jsx -----
// Handles rendering react components on the explore page

// const helper = require('./helper.js');
const React = require('react');
const ReactDOM = require('react-dom');

// ExploreList - Renders the media uploaded by all current users
const ExploreList = (props) => {
    // If no users have uploaded anything, a relevent message is displayed
    if(props.media.length === 0){
        return(
            <div className='exploreList'>
                <h3 className='emptyMedia'>No Media Yet! This Site is Useless!!!</h3>
            </div>
        );
    }

    // Adds a new media node for each pice of media uploaded to the database
    const mediaNodes = props.media.map(media => {
        return(
            <div key={media._id} className='media'>
                <h3 className='mediaName' id='mediaName'> Name: {media.name} </h3>
                <h3 className='mediaSize' id='mediaSize'> Size: {media.size} </h3>
                <h3 className='mediaUploaded' id='mediaUploaded'> Date Uploaded: {media.uploadedDate} </h3>
            </div>
        );
    });

    // Returns the nodes generated above
    return(
        <div className='exploreList'>
            {mediaNodes}
        </div>
    );
};

// To-Do: Replace loadMediaFromServer Function with a function that makes a fetch request to
//  ALL media currently in the database
const loadMediaFromServer = async () => {
    const response = await fetch('/getMedia');
    const data = await response.json();
    ReactDOM.render(<ExploreList media={data.media}/>, document.getElementById('explore'));
};

const init = () => {
    ReactDOM.render(<ExploreList media={[]}/>, document.getElementById('explore'));

    loadMediaFromServer();
};

window.onload = init;