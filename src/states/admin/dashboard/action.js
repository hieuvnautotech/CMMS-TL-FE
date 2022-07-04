import {
    FETCH_REPORT_SUCCESS
} from './types';
//import * as services from '@utils/services';
import { dashboardAPI } from '@constants/api';
const actGetReport = (data) => {
    return dispatch => {
        const url = '';
        return services.get(url)
        .then(res => {
            dispatch({
                type: FETCH_REPORT_SUCCESS,
                data: res
            });
            return {
                status: true,
                data: res
            }
        })
        .catch(err => {
            return {
                status: false,
                error: err
            }
        });
    }
}

export {
    actGetReport
};
