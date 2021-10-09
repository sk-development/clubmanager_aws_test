const https = require('https');
const superagent = require('superagent');
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
            console.log("Anfrage erfolgreich!");
                if (result.valid == false) {
                    console.log("Ergebnis invalid!");
                    return denyAllPolicy();
                } else {
                    if (result.privileges.tenantPrivileges[0].privileges == 'admin') {
                        console.log("Ist globaler Admin!");
                        return allowPolicy(true, 'globalAdmin');
                    } else {
                        const modulePrivileges = getRequestedModulePrivileges(event["headers"]["Module-Type"], result.privileges.tenantModulePrivileges);
                        console.log(modulePrivileges);
                        if (modulePrivileges != 'none') {
                            console.log("Ist ein einfacher Nutzer!");
                            return allowPolicy(false, modulePrivileges);
                        }
                        console.log("Deny!");
                        return denyAllPolicy();
                    }
                }
        })
        .catch((errorMessage) => {
            console.log(errorMessage);
        })
};

function getRequestedModulePrivileges(moduleType, tenantModulePrivileges) {
    for (const privilege of tenantModulePrivileges) {
        if (privilege.module === moduleType) {
            return privilege.privileges;
        }
    }
    // return 'none';
}

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
function allowPolicy(isGlobalAdmin, modulePrivileges) {
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
        },
        "context": {
            "isGlobalAdmin": isGlobalAdmin,
            "modulePrivileges": modulePrivileges
        }
    }
}

function doPostRequest(event) {
    return new Promise((resolve, reject) => {
        const key = event["headers"]["x-apikey"];
        superagent
            .post('https://' + process.env.HOST + '/api/verify-authentication')
            .set('Content-Type', 'application/json')
            .set('x-accesstoken', process.env.XACCESSTOKEN)
            .send({'apikey': key})
            .then((res) => {
                const test = res.body
                resolve(res.body);
            })
            .catch((err) => {
                reject(err.status);
            });
        console.log("Bin zumindest mal hier1");
        console.log("Bin zumindest mal hier2");
    })
}

// function doPostRequest(event) {
//     return new Promise((resolve, reject) => {
//         const key = event["headers"]["x-apikey"];
//         // how to access the x-apikey from the event!?
//         // const key = event["headers"]["apikey"];
//         // const key = event.apikey;
//         const options = {
//             host: process.env.HOST, //set to env variable
//             path: '/api/verify-authentication',
//             method: 'POST',
//             headers: {
//                 'Content-Type': 'application/json',
//                 'x-accesstoken': process.env.XACCESSTOKEN //set to env variable
//             },
//             body: {
//                 'apikey': key
//             }
//         };
//         //create the request object with the callback with the result
//         const req = https.request(options, (res) => {
//             var body = '';
//             res.on('data', function(chunk) {
//                 body += chunk;
//               });
//             res.on('end', function() {
//                 resolve(body);
//             });
//         });
//         // handle the possible errors
//         req.on('error', (e) => {
//             reject(e.message);
//         });
//         // //do the request
//         // req.write(JSON.stringify(data));
//         console.log("Bin zumindest mal hier1");
//         //finish the request
//         req.end();
//         console.log("Bin zumindest mal hier2");
//     });
// };