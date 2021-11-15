var modulePrivilegesHelper = require('./module_privileges_helper');
var localAuthorizerHelper = require('./local_authorizer_helper');

function handle(businessLogicCallback, event) {
    try {
        var result = businessLogicCallback(event);
        handledResult = handleResult(result);
    }
    catch (err) {
        handledResult = {
            statusCode: 500,
            data: err
        }
    }
    return packageHttpResponse(handledResult);
}

async function handleAsync(businessLogicCallback, event) {
    /* old version */
    // var handledResult;
    // try {
    //     var result = await businessLogicCallback(event);
    //     handledResult = handleResult(result);
    // }
    // catch (err) {
    //     handledResult = {
    //         statusCode: 500,
    //         data: err
    //     }
    // }
    // return packageHttpResponse(handledResult);


    /* new version */
    var handledResult;
    if (process.env.AWS_SAM_LOCAL) {
        var localAuthorizerResult = await localAuthorizerHelper.localAuthorizer(event);
        const customEvent =
        {
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
        modulePrivilegesHelper.processModulePrivileges(customEvent)
        try {
            var result = await businessLogicCallback(customEvent);
            handledResult = handleResult(result);
        }
        catch (err) {
            handledResult = {
                statusCode: 500,
                data: err
            }
        }
    }
    else {
        try {
            var result = await businessLogicCallback(event);
            handledResult = handleResult(result);
        }
        catch (err) {
            handledResult = {
                statusCode: 500,
                data: err
            }
        }
    }
    return packageHttpResponse(handledResult);
}

function handleResult(result) {
    var statusCode;
    // isn't executionSuccessful always true? See lambda_get_surveys.index
    // Or just for the special case of getting all surveys, because with no input parameter present nothing can go wrong
    // expect the 500-error handled by the handleAsync function?
    // POssible solution see lambda_get_surveys.index
    if (result.executionSuccessful) {
        statusCode = 200;
    }
    else {
        // TODO: define additional statuscode mappings
        statusCode = 400;
    }
    return {
        statusCode,
        data: result.data
    }
}

function packageHttpResponse(handledResult) {
    return {
        statusCode: handledResult.statusCode,
        headers: {
            "Access-Control-Allow-Origin": "http://localhost:4200",
            // "Access-Control-Allow-Methods": "'OPTIONS,POST,GET'",
            // "Access-Control-Allow-Headers": "'Content-Type, x-apikey, x-tenantid'"
        },
        body: JSON.stringify(handledResult.data)
    }
}

module.exports = {
    handle: handle,
    handleAsync: handleAsync
};