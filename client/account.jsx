// ----- account.jsx -----
// Handles rendering react components on account page

const helper = require('./helper.js');
const React = require('react');
const ReactDOM = require('react-dom');

// handlePassword Function - Handles submission from the PasswordWindow
const handlePassword = (e) => {
    e.preventDefault();
    helper.hideError();

    // Getting a reference to the values in each field
    const passOld = e.target.querySelector('#passOld').value;
    const passNew1 = e.target.querySelector('#passNew1').value;
    const passNew2 = e.target.querySelector('#passNew2').value;

    // Ensuring the values of each field are not null
    if(!passOld || !passNew1 || !passNew2){
        helper.handleError('All fields are required!');
        return false;
    }

    // Ensuring that entries in the new password fields match
    if(passNew1 !== passNew2){
        helper.handleError('New passwords do not match!');
        return false;
    }

    // Sends the form falues in a post request through helper
    helper.sendPost(e.target.action, {passwordOld: passOld, passwordNew1: passNew1, passwordNew2: passNew2});

    return false;
};

// handlePremium Function - Handles submission from the PremiumWindow
const handlePremium = (e) => {
    e.preventDefault();
    helper.hideError();

    // Getting the current 'checked' status of the checkbox
    const premiumActive = e.target.querySelector('#premiumBox').checked;

    // Sends the status of the checkbox in a post request through helper
    helper.sendPost(e.target.action, {enablePremium: premiumActive});

    return false;
}

// handleNuke function - Handles submission from the NukeWindow
const handleNuke = async (e) => {
    e.preventDefault();
    helper.hideError();

    // Getting the current 'checked' status of the checkbox
    if(!e.target.querySelector('#confirmBox').checked){
        helper.handleError('You must confirm your choice to delete your account!');
        return false;
    }
    
    document.getElementById('mediaMessage').classList.add('hidden');

    // Sends a DELETE request through the form action (/nuke), which removes all media entries
    //  owned by the user from the database
    await fetch(e.target.action, { method: 'DELETE'});

    // Sending a DELETE request to the /deleteAccount url, which deletes the user's account
    const deleteResponse = await fetch('/deleteAccount', { method: 'DELETE'});
    
    // Getting the resuld of the account deletion request and either rerouting to the login page or
    //  displaying any relevent errors
    const result = await deleteResponse.json();
    if(result.redirect) {
        window.location = result.redirect;
    }
    if(result.error) {
        helper.handleError(result.error);
    }

    return false;
}

// PasswordWindow - Renders a form the user utilizes to change their password
const PasswordWindow = (props) => {
    return(
        <form id='changeForm'
            name='changeForm'
            onSubmit={handlePassword}
            action='/change'
            method='POST'
            className='mainForm'>
                
            <label htmlFor='passOld'>Old Password: </label>
            <input id='passOld' type='text' name='passOld' placeholder='old password'/>
            <label htmlFor='passNew1'>New Password: </label>
            <input id='passNew1' type='password' name='passNew1' placeholder='new password'/>
            <label htmlFor='passNew2'>New Password: </label>
            <input id='passNew2' type='password' name='pass2' placeholder='retype new password'/>
            <input className='formSubmit' type='submit' value='Change Password'/>
        </form>
    );
};

// PremiumWindow - Renders a form the user utilizes to toggle their premium benefits status
const PremiumWindow = (props) => {
    return(
        <form id='premiumForm'
            name='premiumForm'
            onSubmit={handlePremium}
            action='/premium'
            method='POST'
            className='mainForm'>
                
            <p>Users with a premium account get access to premium benefits, which include a further 10GB of upload storage and zero ads!</p>
            <label htmlFor='premiumBox' id='checkLabel'>Enable Premium Benefits: </label>
            <input id='premiumBox' type='checkbox' name='premiumBox'/>
            <input className='formSubmit' type='submit' value='Update'/>
        </form>
    );
};

// NukeWindow - Renders a form the user utilizes to delete their account
const NukeWindow = (props) => {
    return(
        <form id='nukeForm'
            name='nukeForm'
            onSubmit={handleNuke}
            action='/nuke'
            method='DELETE'
            className='mainForm'>
                
            <h3>Want to Delete Your Account?</h3>
            <p>Warning: Deleting your account will also delete everything you've ever uploaded. There is no going back.</p>
            <label htmlFor='confirmBox' id='checkLabel'>I understand: </label>
            <input id='confirmBox' type='checkbox' name='confirmBox'/>
            <input className='formSubmit' type='submit' value='Nuke'/>
        </form>
    );
};

// Init Function - Renders both PasswordWindow, PremiumWindow, and NukeWindow to the page
const init = () => {
    ReactDOM.render(<PasswordWindow/>, document.getElementById('change'));
    ReactDOM.render(<PremiumWindow/>, document.getElementById('premium'));
    ReactDOM.render(<NukeWindow/>, document.getElementById('nuke'));
};

window.onload = init;