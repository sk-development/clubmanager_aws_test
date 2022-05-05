'use strict';

var cloudIntegration = require(process.env.AWS ? '/opt/aws-integration/index' : '../layers/aws-integration/index');

exports.handler = async (event) => {
    return await cloudIntegration.LAMBDA_PROXY_ADAPTER.handleAsync(prepareInput, requiredPrivileges, validate, businessLogic, event);
};

function prepareInput(event) {
    return cloudIntegration.INPUT_ADAPTER.convertSurveyId(event);
}

function requiredPrivileges(inputObject) {
    return cloudIntegration.PRIVILEGES.require().tenantAdmin().or().survey_admin().or().survey_user();
}

async function validate(inputObject, validate) {
    if (inputObject.id != null)
        validate.entryExists(inputObject, cloudIntegration.SURVEY_REPOSITORY);
}

async function businessLogic(inputObject) {
    if (inputObject.id == null)
        var data = await cloudIntegration.SURVEY_REPOSITORY.getSurveys();
    else
        // TODO: wenn die Details aus den Validation-Schritten zurückggb. werden (muss noch implementiert werden), dann gleich den validation step auslesen:
        var data = await cloudIntegration.SURVEY_REPOSITORY.getById(inputObject.id);
    return {
        executionSuccessful: true,
        data
    }
}