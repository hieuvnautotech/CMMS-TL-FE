import { combineReducers } from 'redux';
import { reducer as formReducer } from 'redux-form';

import AdminReducer from './admin';
import { Store } from './typeReducers';

export default function createReducer() {
    return combineReducers({
        [Store.ADMIN_REDUCER]: AdminReducer,
        form: formReducer
    });
};



