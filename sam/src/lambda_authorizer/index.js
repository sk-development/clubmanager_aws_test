const superagent = require('superagent');
exports.handler = async (event) => {
    return doPostRequest(event)
        .then((result) => {
            if (result.valid == false) {
                console.log("result invalid!");
                return denyAllPolicy();
            } else {
                if (result.privileges.tenantPrivileges[0].privileges == 'admin') {
                    console.log("is global admin!");
                    return allowPolicy(true, 'globalAdmin');
                } else {
                    const modulePrivileges = getRequestedModulePrivileges(event.headers['module-type'], result.privileges.tenantModulePrivileges);
                    console.log(modulePrivileges);
                    if (modulePrivileges != null) {
                        console.log("is normal user!");
                        return allowPolicy(false, modulePrivileges);
                    }
                    console.log("Deny!");
                    return denyAllPolicy();
                }
            }
        })
        .catch((errorMessage) => {
            console.log('error:')
            console.log(errorMessage);
        })
};

function getRequestedModulePrivileges(moduleType, tenantModulePrivileges) {
    for (const privilege of tenantModulePrivileges) {
        if (privilege.module === moduleType) {
            return privilege.privileges;
        }
    }
    return null;
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
        // const key = event.authorizationToken;
        // const key = event.headers.authorizationToken;
        const key = event.headers['x-apikey'];
        superagent
            .post(process.env.HOST + 'api/verify-authentication')
            .set('Content-Type', 'application/json')
            .set('x-accesstoken', process.env.XACCESSTOKEN)
            .send({ 'apikey': key })
            .then((res) => {
                const test = res.body
                resolve(res.body);
            })
            .catch((err) => {
                reject(err);
            });
    })
}