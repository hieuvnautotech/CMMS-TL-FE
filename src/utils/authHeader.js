
//attacj vào header của mỗi request với token uỷ quyền

import * as ConfigConstants from '@constants/ConfigConstants';

export const AuthHeader = () => {
    // return authorization header with jwt token
    let user = JSON.parse(localStorage.getItem(ConfigConstants.CURRENT_USER));

    if (user && user.access_token) {
        return { 
            'Authorization': 'Bearer ' + user.access_token,//access_token
             'X-Authorization': 'Bearer ' + user.refresh_token//refresh_token
     };
    } else {
        return {};
    }
};