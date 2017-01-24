import * as types from 'actions/ActionTypes';
import update from 'react-addons-update';

const initialState = {
    status: {
        isLoggedIn: false,
        currentUser: '',
        valid:false
    }
    , login: {
        status: 'INIT',
        errors: {
            summary: '',
            email: '',
            name: '',
            password: ''
        },
    }, register: {
        status: 'INIT',
        errors: {
            summary: '',
            email: '',
            name: '',
            password: ''
        }
    }
};

export default function authentication(state, action) {
    if (typeof state === "undefined")
        state = initialState;

    switch (action.type) {
        /* LOGIN */
        case types.AUTH_LOGIN:
            return update(state, {
                login: {
                    status: {$set: 'WAITING'}
                }
            });
        case types.AUTH_LOGIN_SUCCESS:
            return update(state, {
                login: {
                    status: {$set: 'SUCCESS'}
                },
                status: {
                    isLoggedIn: { $set: true }
                  , currentUser: { $set: action.username }
                }

            });
        case types.AUTH_LOGIN_FAILURE:
            return update(state, {
                login: {
                    status: {$set: 'FAILURE'}
                }
            });

        /* FB_LOGIN */
        case types.FB_AUTH_LOGIN:
            return update(state, {
                login: {
                    status: {$set: 'WAITING'}
                }
            });
        case types.FB_AUTH_LOGIN_SUCCESS:
            return update(state, {
                login: {
                    status: {$set: 'SUCCESS'}
                },
                status: {
                    isLoggedIn: { $set: true }
                    , currentUser: { $set: action.username }
                }

            });
        case types.FB_AUTH_LOGIN_FAILURE:
            return update(state, {
                login: {
                    status: {$set: 'FAILURE'}
                }
            });

        /* GL_LOGIN */
        case types.GL_AUTH_LOGIN:
            return update(state, {
                login: {
                    status: {$set: 'WAITING'}
                }
            });
        case types.GL_AUTH_LOGIN_SUCCESS:
            return update(state, {
                login: {
                    status: {$set: 'SUCCESS'}
                },
                status: {
                    isLoggedIn: { $set: true }
                    , currentUser: { $set: action.username }
                }

            });
        case types.GL_AUTH_LOGIN_FAILURE:
            return update(state, {
                login: {
                    status: {$set: 'FAILURE'}
                }
            });

            /*REGISTER*/
        case types.AUTH_REGISTER:
            return update(state, {
                register: {
                    status: {$set: 'WAITING'}
                }
            });
        case types.AUTH_REGISTER_SUCCESS:
            return update(state, {
                register: {
                    status: {$set: 'SUCCESS'}
                }
            });
        case types.AUTH_REGISTER_FAILURE:
            return update(state, {
                register: {
                    status: {$set: 'FAILURE'},
                    errors: {
                        summary: {$set: action.errorMessage},
                        email: {$set: action.errorEmail},
                        password: {$set: action.errorPassword},
                        name: {$set: action.errorName}
                    }
                }
            });
        case types.AUTH_GET_STATUS:
            return update(state, {
                status: {
                    isLoggedIn: { $set: true }
                }
            });
        case types.AUTH_GET_STATUS_SUCCESS:
            return update(state, {
                status: {
                    valid: { $set: true },
                    currentUser: { $set: action.username }
                }
            });
        case types.AUTH_GET_STATUS_FAILURE:
            return update(state, {
                status: {
                    valid: { $set: false },
                    isLoggedIn: { $set: false }
                }
            });

        /* LOGOUT */
        case types.AUTH_LOGOUT:
            return update(state, {
                status: {
                    isLoggedIn: {$set: false},
                    currentUser: {$set: ''}
                }
            });

        default:
            return state;
    }
}


