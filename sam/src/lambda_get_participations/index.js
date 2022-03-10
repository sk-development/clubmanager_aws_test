'use strict';

var cloudIntegration = require(process.env.AWS ? '/opt/aws-integration/index' : '../layers/aws-integration/index');

exports.handler = async (event) => {
    return await cloudIntegration.LAMBDA_PROXY_ADAPTER.handleAsync(prepareInput, requiredPrivileges, validate, businessLogic, event);
};

function prepareInput(event) {
    return cloudIntegration.INPUT_ADAPTER.convertAllParticipationPathIds(event);
}

function requiredPrivileges(inputObject) {
    if (inputObject.participationId != null || inputObject.userId != null)
        return cloudIntegration.PRIVILEGES.require().tenantAdmin().or().survey_admin().or().survey_user();
    return cloudIntegration.PRIVILEGES.require().tenantAdmin().or().survey_admin();
}

async function validate(inputObject, validate) {
    if (inputObject.id != null)
        return validate.entryExists(inputObject, cloudIntegration.PARTICIPATION_REPOSITORY);
    return true;
}

async function businessLogic(inputObject) {
    if (inputObject.userId != null)
        var data = await cloudIntegration.PARTICIPATION_REPOSITORY.getUserParticipations(inputObject.userId);
    if (inputObject.surveyId != null)
        var data = await cloudIntegration.PARTICIPATION_REPOSITORY.getSurveyParticipations(inputObject.surveyId);
    if (inputObject.id != null)
        var data = await cloudIntegration.PARTICIPATION_REPOSITORY.getParticipationById(inputObject.id);
    else
        var data = await cloudIntegration.PARTICIPATION_REPOSITORY.getAllParticipations();
    return {
        executionSuccessful: true,
        data
    }
}