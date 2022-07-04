
import * as ConfigConstants from '@constants/ConfigConstants';
import { Redirect } from 'react-router-dom';
import React from 'react';

const isAuthenticate = () => {

   // return true;
    let isAuthen = false;
    const currentUser = JSON.parse(localStorage.getItem(ConfigConstants.CURRENT_USER));

    if (currentUser) {
   
        if (currentUser.UserId) {
            isAuthen = true;
        }
    }
    return isAuthen;
}

const authenticateRoute = (Component, route) => (props) => {
    if (!isAuthenticate()) {
       
        return <Redirect to={route || '/login'} />;
    }
    if (Component === null) {
        return null;
    }
   
    return <Component {...props} />;
}

const notAuthenticateRoute = (Component, route) => (props) => {
    if (isAuthenticate()) {
        return <Redirect to={route || '/'} />;
    }

   
    if (Component === null) {
        return null;
    }
    return <Component {...props} />;
}

const LogoutRoute = () => (props) => {
    logOut();
    return <Redirect to={'/'} />;
}

const logOut = () => {
    localStorage.removeItem(ConfigConstants.CURRENT_USER);
};

export {

    isAuthenticate,
    authenticateRoute,
    notAuthenticateRoute,
   // checkExpired,
    logOut,
    LogoutRoute
};
