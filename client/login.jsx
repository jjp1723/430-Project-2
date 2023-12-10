const helper = require('./helper.js');
const React = require('react');
const ReactDOM = require('react-dom');

// handeLogin Function - Handles submissions from the LoginWindow form
const handleLogin = (e) => {
    e.preventDefault();
    helper.hideError();

    // Getting the username and password entered by the user
    const username = e.target.querySelector('#user').value;
    const pass = e.target.querySelector('#pass').value;

    // Validating that the user did enter a username and password
    if(!username || !pass){
        helper.handleError('Username or password is empty!');
        return false;
    }

    // Sending a POST request to the form action (/login), which will proccess the submitted
    //  username and password and redirect to the application if validated
    helper.sendPost(e.target.action, {username, pass});

    return false;
};

// handleSignup Function- Handles submissions from the SignupWindow form
const handleSignup = (e) => {
    e.preventDefault();
    helper.hideError();

    // Getting the username and two passwords entered by the user
    const username = e.target.querySelector('#user').value;
    const pass = e.target.querySelector('#pass').value;
    const pass2 = e.target.querySelector('#pass2').value;

    // Validating that the user did enter a username and two passwords
    if(!username || !pass || !pass2){
        helper.handleError('All fields are required!');
        return false;
    }

    // Validating that the two passwords match
    if(pass !== pass2){
        helper.handleError('Passwords do not match!');
        return false;
    }

    // Sending a POST request to the form action (/signup), which will proccess the submitted
    //  username and passwords and redirect to the application if validated through the
    //  creation of a new account
    helper.sendPost(e.target.action, {username, pass, pass2});

    return false;
};

// LoginWindow - Renders a form the user can use to login to the site
const LoginWindow = (props) => {
    return(
        <form id='loginForm'
            name='loginForm'
            onSubmit={handleLogin}
            action='/login'
            method='POST'
            className='mainForm'>

            <label htmlFor='username'>Username: </label>
            <input id='user' type='text' name='username' placeholder='username'/>
            <label htmlFor='pass'>Password: </label>
            <input id='pass' type='password' name='pass' placeholder='password'/>
            <input className='formSubmit' type='submit' value='Sign in'/>
        </form>
    );
};

// SignupWindow - Renders a form the user can use to sign up to the site
const SignupWindow = (props) => {
    return(
        <form id='signupForm'
            name='signupForm'
            onSubmit={handleSignup}
            action='/signup'
            method='POST'
            className='mainForm'>
                
            <label htmlFor='username'>Username: </label>
            <input id='user' type='text' name='username' placeholder='username'/>
            <label htmlFor='pass'>Password: </label>
            <input id='pass' type='password' name='pass' placeholder='password'/>
            <label htmlFor='pass2'>Password: </label>
            <input id='pass2' type='password' name='pass2' placeholder='retype password'/>
            <input className='formSubmit' type='submit' value='Sign up'/>
        </form>
    );
};

// Init Function - Adds functionality to the Login and Signup buttons at the top of the page and
//  automatically renders the LoginWindow
const init = () => {
    const loginButton = document.getElementById('loginButton');
    const signupButton = document.getElementById('signupButton');

    loginButton.addEventListener('click', (e) => {
        e.preventDefault();
        ReactDOM.render(<LoginWindow/>, document.getElementById('content'));
        return false;
    });

    signupButton.addEventListener('click', (e) => {
        e.preventDefault();
        ReactDOM.render(<SignupWindow/>, document.getElementById('content'));
        return false;
    });

    ReactDOM.render(<LoginWindow/>, document.getElementById('content'));
};

window.onload = init;