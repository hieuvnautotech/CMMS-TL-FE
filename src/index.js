import React from 'react';
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";

import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { DashBoard, Login }  from '@containers';
import 'font-awesome/css/font-awesome.min.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'react-toastify/dist/ReactToastify.css';
import 'jquery.fancytree/dist/skin-lion/ui.fancytree.less';  // CSS or LESS
import '@mdi/font/css/materialdesignicons.css'
//import "aos/dist/aos.css";
import "@styles/css/adminlte.min.css";
 import '@styles/less/tool.less';
 import "./styles/css/App.css";
import 'jquery';
import 'jquery-ui';
import 'bootstrap';



import store from './states/store';

import { authenticateRoute, notAuthenticateRoute,LogoutRoute } from '@utils/Authenticate';

function RouteWrapperLogin(props) {
    const ComponentWrapper = notAuthenticateRoute(Login,
        '/');
    return <ComponentWrapper {...props} />;
}

function RouteWrapperRoot(props) {
    const ComponentWrapper = authenticateRoute(DashBoard,
        '/login');
       
    return <ComponentWrapper {...props} />;
}

function RouteWrapperLogout(props) {
    const ComponentWrapper = LogoutRoute();
    return <ComponentWrapper {...props} />;
}


ReactDOM.render( 
    <Provider store={store({})}> 
     <Router>
                 <Switch>
                <Route
                    exact
                    path='/login'                     
                    component={RouteWrapperLogin} />
                <Route
                exact
                path='/logout'                     
                component={RouteWrapperLogout} />

                 <Route
                     path='/'
                     component={RouteWrapperRoot} />

            </Switch>
     </Router>
     {/* <Layout/>  */}
    
    </Provider>
,document.getElementById('root'));
