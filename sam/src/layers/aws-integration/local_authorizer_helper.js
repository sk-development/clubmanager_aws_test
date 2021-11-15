const superagent = require('superagent');

/* Insert correct values before executing */
var host = '<Backen-API-URL>';
var xaccesstoken = '<XACCESSTOKEN>';

function localAuthorizer(event) {
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
                    /* watch out
                    in local version 'Module-Type' vs. in deployed version 'module-type'
                    */
                    const modulePrivileges = getRequestedModulePrivileges(event.headers['Module-Type'], result.privileges.tenantModulePrivileges);
                    console.log(modulePrivileges);
                    if (modulePrivileges != null) {
                        console.log("is normale user!");
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
}

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
        /* watch out
        in local version 'X-Apikey' vs. in deployed version 'x-apikey'
        in local version host variable vs. in deployed version HOST
        in local version xaccesstoken variable vs. in deployed version TOKEN
        */
        const key = event.headers['X-Apikey'];
        superagent
            .post(host + 'api/verify-authentication')
            .set('Content-Type', 'application/json')
            .set('x-accesstoken', xaccesstoken)
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

module.exports = {
    localAuthorizer: localAuthorizer,
};