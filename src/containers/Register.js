import React, { PropTypes } from 'react';
import { browserHistory } from 'react-router';
import {RegisterForm} from 'components';
import { connect } from 'react-redux';
import { registerRequest } from 'actions/authentication';

class Register extends React.Component {

    /**
     * Class constructor.
     */
    constructor(props) {
        super(props);

        // set the initial component state
        this.state = {
            user: {
                email: '',
                name: '',
                password: ''
            }
        };

        this.processForm = this.processForm.bind(this);
        this.changeUser = this.changeUser.bind(this);
    }

    /**
     * Change the user object.
     *
     * @param {object} event - the JavaScript event object
     */
    changeUser(event) {
        const field = event.target.name;
        const user = this.state.user;
        user[field] = event.target.value;

        this.setState({
            user
        });
    }

    /**
     * Process the form.
     *
     * @param {object} event - the JavaScript event object
     */
    processForm(event) {
        // prevent default action. in this case, action is the form submission event
        event.preventDefault();

        // const password = encodeURIComponent(this.state.user.password);
        const name = this.state.user.name;
        const email = this.state.user.email;
        const password = this.state.user.password;

        return this.props.registerRequest(name,email,password).then(
            () => {
                if(this.props.status === "SUCCESS") {

                    let $toastContent = $('<span style="color: #FFB4BA">Your register success!</span>');
                    Materialize.toast($toastContent, 2000);

                    browserHistory.push('/login');

                    return true;
                } else {
                    return false;
                }
            }
        );

    }

    /**
     * Render the component.
     */
    render() {
        return (
            <RegisterForm
                onSubmit={this.processForm}
                onChange={this.changeUser}
                errors={this.props.errors}
                user={this.state.user}
            />
        );
    }

}

const mapStateToProps = (state) => {
    return {
        status: state.authentication.register.status,
        errors: state.authentication.register.errors
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        registerRequest: (name,email,password) => {
            return dispatch(registerRequest(name,email,password));
        }
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(Register);
