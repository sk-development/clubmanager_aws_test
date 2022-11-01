'use strict';

const superagent = require('superagent')

exports.authorize = async (apiKey) => {
    if (apiKey == null) 
        return Promise.resolve(this.denyAllPolicy());
    return doPostRequest(apiKey)
        .then((result) => {
            if (result.valid) {
                const tenantPrivileges = result.privileges.tenantPrivileges;
                for (const tenantPrivilege of tenantPrivileges) {
                    tenantPrivilege.privileges = tenantPrivilege.privileges.split(',');
                }
                const modulePrivileges = result.privileges.tenantModulePrivileges;
                for (const modulePrivilege of modulePrivileges) {
                    modulePrivilege.privileges = modulePrivilege.privileges.split(',');
                }
                return allowPolicy(tenantPrivileges, modulePrivileges);
            }
            return denyAllPolicy();
        }, () => {
            return denyAllPolicy();
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

function allowPolicy(tenantPrivileges, modulePrivileges) {
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
            "tenantPrivileges": JSON.stringify(tenantPrivileges),
            "modulePrivileges": JSON.stringify(modulePrivileges)
        }
    }
}

function doPostRequest(apiKey) {
    return new Promise((resolve, reject) => {
        superagent
            .post(process.env.AUTH_HOST + 'api/verify-authentication')
            .set('Content-Type', 'application/json')
            .set('x-accesstoken', process.env.AUTH_TOKEN)
            .send({ 'apikey': apiKey })
            .then((res) => {
                if (res.status != 200)
                reject("invalid status code");
                else
                resolve(res.body);
            }, (rej) => {
                reject(rej);
            })
    })
}