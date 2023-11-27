const helper = require('./helper.js');
const React = require('react');
const ReactDOM = require('react-dom');

const handleMedia = (e) => {
    e.preventDefault();
    helper.hideError();

    const name = e.target.querySelector('#mediaName').value;
    const age = e.target.querySelector('#mediaAge').value;
    const weight = e.target.querySelector('#mediaWeight').value;

    if(!name || !age || !weight){
        helper.handleError('All fields are required!');
        return false;
    }

    helper.sendPost(e.target.action, {name, age, weight}, loadMediaFromServer);

    return false;
};

const MomoForm = (props) => {
    return(
        <form id='mediaForm'
            name='mediaForm'
            onSubmit={handleMedia}
            action='/maker'
            method='POST'
            className='mediaForm'>
                
            <label htmlFor='name'>Name: </label>
            <input id='mediaName' type='text' name='name' placeholder='Media Name'/>
            <label htmlFor='age'>Age: </label>
            <input id='mediaAge' type='number' min='0' name='age'/>
            <label htmlFor='weight'>Weight: </label>
            <input id='mediaWeight' type='number' min='0' name='weight'/>
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
                <h3 className='mediaAge' id='mediaAge'> Age: {media.age} </h3>
                <h3 className='mediaWeight' id='mediaWeight'> Weight: {media.weight} </h3>
                <button className='deleteMediaSubmit' type='button' value='Delete Media' onClick={() => deleteMediaFromServer(media)}>Delete Media</button>
            </div>
        );
    });

    return(
        <div className='mediaList'>
            {mediaNodes}
        </div>
    );
};

const loadMediaFromServer = async () => {
    const response = await fetch('/getMedia');
    const data = await response.json();
    ReactDOM.render(<MediaList media={data.media}/>, document.getElementById('media'));
};

const deleteMediaFromServer = async (media) => {
    const response = await fetch('/deleteMedia', {method: 'DELETE', headers: {'Content-Type': 'application/json'}, body: JSON.stringify(media)});
    if(response.status === 201){
        loadMediaFromServer();
    }
}

const init = () => {
    ReactDOM.render(<MomoForm/>, document.getElementById('makeMedia'));

    ReactDOM.render(<MediaList media={[]}/>, document.getElementById('media'));

    loadMediaFromServer();
};

window.onload = init;