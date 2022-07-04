import { combineReducers } from 'redux';
import { Store } from '../typeReducers';

import DashboardReducer from './dashboard';

const reducers = combineReducers({
    [Store.ADMIN_DASHBOARD_REDUCER]: DashboardReducer
});

export default reducers;
