import React, {PropTypes} from 'react';
import {Header} from 'components';
import {connect} from 'react-redux';
import {getStatusRequest,logoutRequest} from 'actions/authentication';


class App extends React.Component {
    constructor(props) {
        super(props);
        this.handleLogout = this.handleLogout.bind(this);
    }


    componentDidMount() {
        console.log("1");
        console.log(this.props.status);

        // get cookie by name
        function getCookie(name) {
            var value = "; " + document.cookie;
            var parts = value.split("; " + name + "=");
            if (parts.length == 2) return parts.pop().split(";").shift();
        }

        // get loginData from cookie
        let loginData = getCookie('jinsil');

        // if loginData is undefined, do nothing
        if (typeof loginData === "undefined") return;

        // decode base64 & parse json
        loginData = JSON.parse(atob(loginData));
        //  console.log(loginData.passport.user.name);

        // if not logged in, do nothing
        if (!loginData.passport.user.isLoggedIn) return;

        // page refreshed & has a session in cookie,
        // check whether this cookie is valid or not
        this.props.getStatusRequest().then(
            () => {
                console.log("2");
                console.log(this.props.status);
                // if session is not valid
                if (!this.props.status.valid) {
                    // logout the session
                    loginData = {
                        isLoggedIn: false,
                        name: ''
                    };

                    document.cookie = 'session=' + btoa(JSON.stringify(loginData));

                    // and notify
                    let $toastContent = $('<span style="color: #FFB4BA">Your session is expired, please log in again</span>');
                    Materialize.toast($toastContent, 4000);

                }
            }
        );
    }

    handleLogout() {
        this.props.logoutRequest().then(
            () => {
                Materialize.toast('Good Bye!', 2000);
            }
        );
    }


    /**
     * Render the component.
     */
    render() {
        return (
            <div>
                <Header isAuth={this.props.status.isLoggedIn}
                        onLogout={this.handleLogout}/>
                {this.props.children}
            </div>
        );
    }

}

App.propTypes = {
    children: PropTypes.object.isRequired
};

const mapStateToProps = (state) => {
    return {
        status: state.authentication.status
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        getStatusRequest: () => {
            return dispatch(getStatusRequest());
        },
        logoutRequest: () => {
            return dispatch(logoutRequest());
        }

    };
};

export default connect(mapStateToProps, mapDispatchToProps)(App);


