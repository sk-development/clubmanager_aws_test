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
    var handledResult;
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
    return packageHttpResponse(handledResult);
}

function handleResult(result) {
    var statusCode;
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