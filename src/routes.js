/**
 * Created by siri on 2017-01-11.
 */
import App from 'App';
import { Home,Login, Register, Post, Admin,Edit } from 'containers';


const routes = {
    // base component (wrapper for the whole application).
    component: App,
    childRoutes: [
        {
            path: '/',
            component: Home
        },
        {
            path: '/login',
            component: Login
        },
        {
            path: '/signup',
            component: Register
        },
        {
            path: '/post',
            component: Post
        },
        {
            path: '/edit/:index/:id',
           // path:'/edit',
            component: Edit
        },
        {
            path: '/admin',
            component: Admin
        },
        {
            path: '/logout',
            onEnter: (nextState, replace) => {
                // change the current URL to /
                replace('/');
            }
        }
    ]
};

export default routes;