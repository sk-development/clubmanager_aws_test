'use strict';

var cloudIntegration = require(process.env.AWS ? '/opt/aws-integration/index' : '../layers/aws-integration/index');

exports.handler = async (event) => {
    return await cloudIntegration.LAMBDA_PROXY_ADAPTER.handleAsync(prepareInput, requiredPrivileges, validate, businessLogic, event);
}

function prepareInput(event) {
    return cloudIntegration.INPUT_ADAPTER.convertSurvey(event);
}

function requiredPrivileges(inputObject) {
    return cloudIntegration.PRIVILEGES.require().tenantAdmin().or().survey_admin();
}

async function validate(inputObject, validate) {
    validate.requiredProperty(inputObject, 'title');
    validate.requiredProperty(inputObject, 'options');
    validate.validDate(inputObject, 'validTo');
}

async function businessLogic(inputObject) {
    return await cloudIntegration.SURVEY_REPOSITORY.createSurvey(inputObject);
}