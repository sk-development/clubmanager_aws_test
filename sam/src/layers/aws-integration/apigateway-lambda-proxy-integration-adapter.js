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