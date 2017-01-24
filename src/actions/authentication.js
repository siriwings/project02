import axios from 'axios';

import {
    AUTH_LOGIN,
    AUTH_LOGIN_SUCCESS,
    AUTH_LOGIN_FAILURE,
    FB_AUTH_LOGIN,
    FB_AUTH_LOGIN_SUCCESS,
    FB_AUTH_LOGIN_FAILURE,
    GL_AUTH_LOGIN,
    GL_AUTH_LOGIN_SUCCESS,
    GL_AUTH_LOGIN_FAILURE,
    AUTH_REGISTER,
    AUTH_REGISTER_SUCCESS,
    AUTH_REGISTER_FAILURE,
    AUTH_GET_STATUS,
    AUTH_GET_STATUS_SUCCESS,
    AUTH_GET_STATUS_FAILURE,
    AUTH_LOGOUT

} from './ActionTypes';

axios.defaults.headers.get['Access-Control-Allow-Origin'] = '*';
axios.defaults.headers.post['Access-Control-Allow-Origin'] = '*';
/*============================================================================
 authentication
 ==============================================================================*/
/* FACEBOOK LOGIN */
export function fbloginRequest() {
    return (dispatch) => {
        // Inform Login API is starting
        dispatch(fblogin());

        // API REQUEST
        return axios.get('/auth/facebook')
            .then((response) => {
                // SUCCEED
                dispatch(fbloginSuccess(response.data.info.name));
                console.log("FB login SUCCEED");
            }).catch((error) => {
                // FAILED
                dispatch(fbloginFailure());
                console.log("FB login Error");
            });
    };
}

export function fblogin() {
    return {
        type: FB_AUTH_LOGIN
    };
}

export function fbloginSuccess(username) {
    return {
        type: FB_AUTH_LOGIN_SUCCESS
        , username
    };
}


export function fbloginFailure() {
    return {
        type: FB_AUTH_LOGIN_FAILURE
    };
}

/* GOOGLE LOGIN */
export function glloginRequest() {
    return (dispatch) => {
        // Inform Login API is starting
        dispatch(gllogin());

        // API REQUEST
        return axios.get('/auth/google')
            .then((response) => {
                // SUCCEED
                dispatch(glloginSuccess(response.data.info.name));
                console.log("GL login SUCCEED");
            }).catch((error) => {
                // FAILED
                dispatch(glloginFailure());
                console.log("GL login Error");
            });
    };
}

export function gllogin() {
    return {
        type: GL_AUTH_LOGIN
    };
}

export function glloginSuccess(username) {
    return {
        type: GL_AUTH_LOGIN_SUCCESS
        , username
    };
}


export function glloginFailure() {
    return {
        type: GL_AUTH_LOGIN_FAILURE
    };
}


/* LOGIN */
export function loginRequest(email, password) {
    return (dispatch) => {
        // Inform Login API is starting
        dispatch(login());

        // API REQUEST
        return axios.post('/auth/login', {email, password})
            .then((response) => {
                // SUCCEED
                console.log("login SUCCEED");
                //console.log(response.data.user.name);
                dispatch(loginSuccess(response.data.info.name));
                // dispatch(loginSuccess());
                //Auth.authenticateUser(response.data.token);
            }).catch((error) => {
                // FAILED
                console.log("login Error");
                dispatch(loginFailure());
            });
    };
}

export function login() {
    return {
        type: AUTH_LOGIN
    };
}
/*
 export function loginSuccess() {
 return {
 type: AUTH_LOGIN_SUCCESS
 };
 }
 */
export function loginSuccess(username) {
    return {
        type: AUTH_LOGIN_SUCCESS
        , username
    };
}


export function loginFailure() {
    return {
        type: AUTH_LOGIN_FAILURE
    };
}

/* REGISTER */
export function registerRequest(name, email, password) {
    return (dispatch) => {
        // Inform Register API is starting
        dispatch(register());

        return axios.post('/auth/signup', {name, email, password})
            .then((response) => {
                dispatch(registerSuccess());
                console.log('The form is valid');
            }).catch((error) => {
                // FAILED
                const errorMessage = error.response.data.message;
                const errorEmail = error.response.data.errors.email;
                const errorPassword = error.response.data.errors.password;
                const errorName = error.response.data.errors.name;

                dispatch(registerFailure(errorMessage, errorName, errorEmail, errorPassword));
            });
    };

}

export function register() {
    return {
        type: AUTH_REGISTER
    };
}

export function registerSuccess() {
    return {
        type: AUTH_REGISTER_SUCCESS,
    };
}

export function registerFailure(errorMessage, errorName, errorEmail, errorPassword) {
    return {
        type: AUTH_REGISTER_FAILURE,
        errorMessage,
        errorEmail,
        errorPassword,
        errorName
    };
}

/* GET STATUS */

export function getStatusRequest() {
    return (dispatch) => {
        // inform Get Status API is starting
        dispatch(getStatus());
        console.log("getinfo 액션");
        return axios.get('/auth/getinfo')
            .then((response) => {
                console.log(response.data);
                dispatch(getStatusSuccess(response.data.info.name));

            }).catch((error) => {
                dispatch(getStatusFailure());
            });
    };
}

export function getStatus() {
    return {
        type: AUTH_GET_STATUS
    };
}

export function getStatusSuccess(username) {
    return {
        type: AUTH_GET_STATUS_SUCCESS,
        username
    };
}

export function getStatusFailure() {
    return {
        type: AUTH_GET_STATUS_FAILURE
    };
}

/* Logout */

export function logoutRequest() {
    return (dispatch) => {
        return axios.get('/auth/logout')
            .then((response) => {
                dispatch(logout());
            });
    };
}

export function logout() {
    return {
        type: AUTH_LOGOUT
    };
}
