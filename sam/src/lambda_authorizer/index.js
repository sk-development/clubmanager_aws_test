const https = require('https');

exports.handler = (event) => {
    // // await doPostRequest(event)
    // //     .then(result => {
    // //         if (result.valid == true) {
    // //             return allowPolicy(event.methodArn);
    // //         } else {
    // //             denyAllPolicy();
    // //         }
    // //     }
    // //     )
    // //     .catch(err);
    //     var isValidUser = await doPostRequest(event);
    //     if (isValidUser.result.valid) {
    //         return allowPolicy(event.methodArn);
    //     } else {
    //         denyAllPolicy();
    //     }
    //     // switch to just async/await!?!
    //     // result in variable
    //     // check var and do stuff


    // // if (event.authorizationToken === "12345")
    // //     return allowPolicy(event.methodArn);

    // // return denyAllPolicy();

        // if(event.authorizationToken === "12345")
    //     return allowPolicy(event.methodArn);
    console.log("Anfrage noch nicht gestartet!");
    doPostRequest(event)
        .then((result) => {
            console.log(result.data);
            console.log("Anfrage erfolgreich!");
                if (result.valid == true) {
                    return allowPolicy(event.methodArn);
                } else {
                    return denyAllPolicy();
                }
        })
        .catch((errorMessage) => {
            console.log(errorMessage);
        })
};

function denyAllPolicy() {
    return {
        "principalId": "*",
        "policyDocument": {
            "Version": "2012-10-17",
            "Statement": [
                {
                    "Action": "*",
                    "Effect": "Deny",
                    "Resource": "*"
                }
            ]
        }
    }
}
function allowPolicy(methodArn) {
    return {
        "principalId": "apigateway.amazonaws.com",
        "policyDocument": {
            "Version": "2012-10-17",
            "Statement": [
                {
                    "Action": "execute-api:Invoke",
                    "Effect": "Allow",
                    "Resource": "*"
                }
            ]
        }
    }
}
function doPostRequest(event) {
    return new Promise((resolve, reject) => {
        const key = event["headers"]["x-apikey"];
        // how to access the x-apikey from the event!?
        // const key = event["headers"]["apikey"];
        // const key = event.apikey;
        const options = {
            host: process.env.HOST, //set to env variable
            path: '/api/verify-authentication',
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-accesstoken': process.env.XACCESSTOKEN //set to env variable
            },
            body: {
                'apikey': key
            }
        };
        let body = [];
        //create the request object with the callback with the result
        const req = https.request(options, (res) => {
            console.log(res);
            console.log("Bin zumindest mal hier123");
            resolve(res);
        });
        // handle the possible errors
        req.on('error', (e) => {
            reject(e.message);
        }).on('data', (data) => {
            body.push(data)
            console.log(data);
        })
        // //do the request
        // req.write(JSON.stringify(data));
        console.log("Bin zumindest mal hier1");
        //finish the request
        req.end();
        console.log("Bin zumindest mal hier2");
    });
};