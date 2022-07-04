import {
    FETCH_REPORT_SUCCESS
} from './types';

const initializeState = {
    reports: {}
};

const reducer = (state = initializeState, action) => {
    let newState = { ...state };
    switch (action.type) {
        case FETCH_REPORT_SUCCESS:
            newState.reports = action.data;
            break;
        default:
            break;

    }
    return { ...newState };
};

export default reducer;
