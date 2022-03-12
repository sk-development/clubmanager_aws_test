const superagent = require('superagent');

/* Insert correct values before executing */
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
    var host = process.env.AUTH_HOST;
    var xaccesstoken = process.env.AUTH_TOKEN;
    
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

function getCustomAuthorizedEvent(event, localAuthorizerResult) {
    return {
        body: event.body,
        headers: event.headers,
        httpMethod: event.httpMethod,
        isBase64Encoded: event.isBase64Encoded,
        multiValueHeaders: event.multiValueHeaders,
        multiValueQueryStringParameters: event.multiValueQueryStringParameters,
        path: event.path,
        pathParameters: event.pathParameters,
        queryStringParameters: event.queryStringParameters,
        requestContext: {
            accountId: event.requestContext.accountId,
            apiId: event.requestContext.apiId,
            domainName: event.requestContext.domainName,
            extendedRequestId: event.requestContext.extendedRequestId,
            httpMethod: event.requestContext.httpMethod,
            identity: event.requestContext.identity,
            path: event.requestContext.path,
            protocol: event.requestContext.protocol,
            requestId: event.requestContext.requestId,
            requestTime: event.requestContext.requestTime,
            requestTimeEpoch: event.requestContext.requestTimeEpoch,
            resourceId: event.requestContext.resourceId,
            resourcePath: event.requestContext.resourcePath,
            stage: event.requestContext.stage,
            authorizer: {
                isGlobalAdmin: localAuthorizerResult.context.isGlobalAdmin,
                modulePrivileges: localAuthorizerResult.context.modulePrivileges
            }
        },
        resource: event.resource,
        stageVariables: event.stageVariables,
        version: event.version
    }
}

module.exports = {
    localAuthorizer: localAuthorizer,
    getCustomAuthorizedEvent: getCustomAuthorizedEvent
};