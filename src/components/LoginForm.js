import React, { PropTypes } from 'react';
import { Link } from 'react-router';
import { Card, CardText } from 'material-ui/Card';
import FlatButton from 'material-ui/FlatButton';
import RaisedButton from 'material-ui/RaisedButton';
import TextField from 'material-ui/TextField';
import { FacebookLogin } from 'react-facebook-login-component';


const LoginForm = ({
    onSubmit,
    onChange,
    errors,
    user,
    responseFacebook
}) => (
    <Card className="container">
        <form action="/" onSubmit={onSubmit}>
            <h2 className="card-heading">Login</h2>
            <div className="field-line">
                <TextField
                    floatingLabelText="Email"
                    name="email"
                    //errorText={errors.email}
                    onChange={onChange}
                    value={user.email}
                />
            </div>

            <div className="field-line">
                <TextField
                    floatingLabelText="Password"
                    type="password"
                    name="password"
                    onChange={onChange}
                   // errorText={errors.password}
                    value={user.password}
                />
            </div>

            <div className="button-line">
                <RaisedButton type="submit" label="Log in" primary />
            </div>

            <CardText>Don't have an account? <Link to={'/signup'}>Create one</Link>.</CardText>
        </form>

        <div>
            <FlatButton label="FACEBOOK" secondary={true} onClick={responseFacebook} />
        </div>
    </Card>
);

LoginForm.propTypes = {
    onSubmit: PropTypes.func.isRequired,
    onChange: PropTypes.func.isRequired,
    errors: PropTypes.object.isRequired,
    user: PropTypes.object.isRequired
};

export default LoginForm;