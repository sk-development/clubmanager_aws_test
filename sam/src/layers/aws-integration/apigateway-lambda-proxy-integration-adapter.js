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

async function handleAsync(prepareInputCallback, businessLogicCallback, event) {
    var preparedInput = prepareInputCallback(event);
    var handledResult;
    if (process.env.AWS_SAM_LOCAL) {
        var localAuthorizerResult = await localAuthorizerHelper.localAuthorizer(event);
        if(localAuthorizerResult.policyDocument.Statement[0].Effect == "Allow") {
            const customEvent = localAuthorizerHelper.getCustomAuthorizedEvent(event, localAuthorizerResult)
            modulePrivilegesHelper.processModulePrivileges(customEvent)
            try {
                var result = await businessLogicCallback(preparedInput);
                handledResult = handleResult(result);
            }
            catch (err) {
                handledResult = {
                    statusCode: 500,
                    data: err
                }
            }
        } else {
            handledResult = {
                statusCode: 403,
                data: "Local Authorization failed!"
            }
        }
    }
    else {
        modulePrivilegesHelper.processModulePrivileges(event)
        try {
            var result = await businessLogicCallback(preparedInput);
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
    if (result.executionSuccessful) {
        statusCode = 200;
        return {
            statusCode,
            data: result.data
        }
    }
    else {
        // 400 for Bad Request, e.g., wrong syntax of input variables
        statusCode = 400;
        // 403 if the user is not authorized for the requested action
        if(result.requestedActionForbidden) {
            statusCode = 403;
        }
        return {
            statusCode,
            data: result.errorMessage
        }
    }
}

function packageHttpResponse(handledResult) {
    return {
        statusCode: handledResult.statusCode,
        headers: {
            "Access-Control-Allow-Origin": "*",
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