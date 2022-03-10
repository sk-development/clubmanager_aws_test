'use strict';

var cloudIntegration = require(process.env.AWS ? '/opt/aws-integration/index' : '../layers/aws-integration/index');

exports.handler = async (event) => {
    return await cloudIntegration.LAMBDA_PROXY_ADAPTER.handleAsync(prepareInput, requiredPrivileges, validate, businessLogic, event);
}

function prepareInput(event) {
    return cloudIntegration.INPUT_ADAPTER.convertParticipation(event);
}

function requiredPrivileges(inputObject) {
    return cloudIntegration.PRIVILEGES.require().tenantAdmin().or().survey_admin().or().survey_user();
}

async function validate(inputObject, validate) {
    validate.entryExists(inputObject, cloudIntegration.PARTICIPATION_REPOSITORY);
    validate.requiredProperty(inputObject, 'userId');
    validate.requiredProperty(inputObject, 'surveyId');
}

async function businessLogic(inputObject) {
    return await cloudIntegration.PARTICIPATION_REPOSITORY.updateParticipation(inputObject);
}