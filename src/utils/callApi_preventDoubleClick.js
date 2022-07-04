import { api_get, api_post, AlertSuccess, ErrorAlert } from "@utils";

var clicks = 0; var timer = null; var current_uid;

 function api_post_prevent_doubleclick(url, data, callback) {
    clicks++

    if (clicks === 1) {
        current_uid = generateUID();
        var uid = current_uid;

        timer = setTimeout(function () {

            if (callback) {

                new Promise(function (Resolve, Reject) {
                   // $('.ajaxloading').show();

                   api_post(url, data)
                        .then(function (res) {

                            // clicks = 0;
                            if (uid == current_uid) {

                               // $('.ajaxloading').hide();
                            }
                         //   console.log(res)
                            //if (res.success) {

                                Resolve("");
                                if (uid == current_uid) {
                                    callback(res);
                                }

                          //  } else Reject("");

                        }).catch(error=>{

                            Reject("");

                        })


                });

            }
            clicks = 0;
        }, 350);

    } else {

        clearTimeout(timer);    //prevent single-click action
        //  alert("Double Click");  //perform double-click action
        clicks = 0;             //after action performed, reset counter
    }

}

function generateUID() {
    // I generate the UID from two parts here 
    // to ensure the random number provide enough bits.
    var firstPart = (Math.random() * 46656) | 0;
    var secondPart = (Math.random() * 46656) | 0;
    firstPart = ("000" + firstPart.toString(36)).slice(-3);
    secondPart = ("000" + secondPart.toString(36)).slice(-3);
    return firstPart + secondPart;
}

export {api_post_prevent_doubleclick}