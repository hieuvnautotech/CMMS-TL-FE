import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom";
import { AuthHeader , GetMenus_LoginUser} from '@utils';
import * as ConfigConstants from '@constants/ConfigConstants';
import * as TextConstants from '@constants/TextConstants';
import { toast } from 'react-toastify';

//import { notifyError } from '@basesShared/common';
import jwt from 'jsonwebtoken';
const accessTokenKey = "access-token";
const refreshAccessTokenKey = `x-${accessTokenKey}`;

//xử lý login 
function login(username, password, rememberMe) {
    const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({Account: username,Password: password })
    };
    return new Promise((resolve,reject)=>{

         fetch(ConfigConstants.API_URL + 'Auth/login', requestOptions)
        .then(handleResponse, handleError)
        .then(result => {
                if (result.succeeded) {
                    let data = jwt.decode(result.data);
                    data.access_token = result.access_token;
                    data.refresh_token=result.refresh_token;

                    get_loginUserInfo( result.access_token,result.refresh_token).then(res2=>{
                     
                        if (res2.succeeded) {
                           
                            data.user_info=res2.data;
                           // GetMenus_LoginUser(data.user_info.menus);
                            localStorage.setItem(ConfigConstants.CURRENT_USER, JSON.stringify(data));


                        
                            resolve(data);
        
                        } else {
                            reject(res2.errors);
                        }
                    });


                } else 
                reject(result.errors);
        });
      });
   
}

function logout() {
    // remove user from local storage to log user out
    localStorage.removeItem(ConfigConstants.CURRENT_USER);
}

//hàm nội tại, khi login thành công lấy thêm thông tin user
function get_loginUserInfo(access_token, token_refresh) {
    const requestOptions = {
        method: 'GET',
        headers:new Headers({
            'Authorization': 'Bearer '+ access_token, 
            'X-Authorization': 'Bearer '+ token_refresh, 
        })
       
    };

    
    return fetch(ConfigConstants.API_URL + 'Auth/getLoginUser', requestOptions).then(handleResponse, handleError);
}

//lấy dữ liệu từ backend thông qua httpGet
function api_get(endpoint, data) {
    var strParams=""
   if (data) {
        for (var key in data) {
        if (strParams != "") {
            strParams += "&";
        }
        strParams += key + "=" + (data[key]? encodeURIComponent(data[key]):'');
    }

   }
    const requestOptions = {
        method: 'GET',
        headers: AuthHeader(),
    };
    return new Promise((resolve,reject)=> {

        fetch(ConfigConstants.API_URL + endpoint + "?" + strParams , requestOptions)
        .then(handleResponse, handleError)
        .then (res=> {
           
            if (res.succeeded) {
                resolve(res.data)
            } else {

                toast.error( <ErrorDisplay errors={res.errors} /> , {
                    position: "top-right",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    enableHtml : true
                    });
                reject(res.errors)
            }
        })

    });
    
    
}



function ErrorDisplay({errors}) {
   
    let listErrors=[];
    if (typeof errors === 'string') {
        listErrors.push(<li key="1">{errors}</li>)
    } else if (typeof errors === 'object') {
      
        let key_id=0;
        for (let key in errors) { 
            key_id++;
            listErrors.push(<li key={key_id}>{errors[key]}</li>)     
           
        }
    }
   
    return (
       <ul>{listErrors}</ul>
       
    )
  }

//lấy dữ liệu từ backend thông qua httpost
function api_post(endpoint, data) {
    
    const requestOptions = {
        method: 'POST',
        headers: { ...AuthHeader(), 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    };

    return  new Promise((resolve,reject)=> { 
        fetch(ConfigConstants.API_URL + endpoint, requestOptions).then(handleResponse, handleError)
        .then (res=> {
               
            if (res.succeeded) {
                resolve(res.data)
            } else 
            {
                toast.error( <ErrorDisplay errors={res.errors} />, {
                    position: "top-right",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    
                    });
                    reject(res.errors)
            }
            
          
        })
    });
   
}





function handleResponse(response) {

    return new Promise((resolve, reject) => {
        if (response.ok) {
        
            var contentType = response.headers.get("content-type");
            var access_token = response.headers.get(accessTokenKey);
            var refresh_token = response.headers.get(refreshAccessTokenKey);

            if (contentType && contentType.includes("application/json")) {
                // alert(result)
                response.json().then(json => {
                   if (access_token)  {
                    json.access_token=access_token;
                   }
                  if (refresh_token)  {
                    json.refresh_token=refresh_token;
                    let user = JSON.parse(localStorage.getItem(ConfigConstants.CURRENT_USER));
                    if (user){
                        user.refresh_token=refresh_token;
                       // localStorage.setItem(ConfigConstants.CURRENT_USER, JSON.stringify(data));
                        console.log('1111111111')
                    }
                  

                  }

                    resolve(json)
                });
            } else {
                resolve(response);
            }
        } else {
            try {
                const { emitRedirectSignIn } = eventEmitterAuthenticate;

                switch (response.status) {
                    case 400:
                        response.json().then(json => {
                            let errorMsg = {};
                            if (typeof json === 'object') {
                                for (var propertyName in json) {
                                    var property = json[propertyName];
                                    //edited by nnhieu
                                    // if (propertyName === "error") {
                                    //     notifyError(property)
                                    //     return reject();
                                    // } else {
                                        //errorMserrorMsgg[propertyName] = property[0];
                                    //}
                                    if (propertyName === "error") {
                                        errorMsg[propertyName] = property;
                                    } else
                                    errorMsg[propertyName] = property[0];
                                }
                                return reject(errorMsg);
                            } else {
                                try {
                                    let jsonObj = JSON.parse(json);
                                    if (typeof jsonObj === 'object') {
                                        for (var propertyName in jsonObj) {
                                            var property = jsonObj[propertyName];
                                            if (propertyName === "error") {
                                                notifyError(property)
                                                return reject();
                                            } else {
                                                errorMsg[propertyName] = property;
                                            }
                                        }
                                    } else {
                                        notifyError(jsonObj);
                                    }
                                    return reject(errorMsg);
                                } catch (e) {
                                    errorMsg = json;
                                    notifyError(json);
                                    return reject(errorMsg);
                                }
                            }
                        });
                        break;
                    case 401:
                        console.log(response);
                        notifyError(
                            `${TextConstants.TEXT_LOGIN_AGAIN_MSG}. Tự động chuyển hướng sang trang đăng nhập.`
                        );
                        emitRedirectSignIn({
                            redirectUrl: '/login'
                        });
                        return reject(response);
                    case 403:
                        console.log(response);
                        notifyError(
                            `${TextConstants.TEXT_FORBIDDEN}. Tự động chuyển hướng sang trang đăng nhập.`
                        );
                        emitRedirectSignIn({
                            redirectUrl: '/login'
                        });
                        return reject(response);
                    case 404:
                        return reject("Không tìm thấy trang bạn yêu cầu");
                    default:
                        return reject(response);
                }
            }
            catch (ex) {
            }
        }
    });
};

function handleError(error) {
   // notifyError({ text: error.message })
   if ( error.message )
   toast.error( error.message , {
    position: "top-right",
    autoClose: 5000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    });
    return Promise.reject(error && error.message);
}

export {
    login,
   // loginFacebook,
  //  loginGoogle,
    logout,

    api_get,
    api_post


};

