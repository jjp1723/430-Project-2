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
            <input className='formSubmit' type='submit' value='Password Change'/>
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
            <label htmlFor='premiumBox'>Enable Premium Benefits: </label>
            <input id='premiumBox' type='checkbox' name='premiumBox'/>
            <input className='formSubmit' type='submit' value='Password Change'/>
        </form>
    );
};

// Init Function - Renders both PassWordWindow and PremiumWindow to the page
const init = () => {
    ReactDOM.render(<PasswordWindow/>, document.getElementById('change'));
    ReactDOM.render(<PremiumWindow/>, document.getElementById('premium'));
};

window.onload = init;