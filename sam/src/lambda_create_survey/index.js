var cloudIntegration = require(process.env.AWS ? '/opt/aws-integration/index' : '../layers/aws-integration/index');

exports.handler = async (event) => {
    return await cloudIntegration.LAMBDA_PROXY_ADAPTER.handleAsync(prepareInput, businessLogic, event);
}

class InputObject {
    constructor(businessObject) {
        this.businessObject = businessObject;
    }
}

function prepareInput(event) {
    var surveyData = cloudIntegration.EVENT_HELPER.getSurveyData(event);
    return new InputObject(surveyData);
}

async function businessLogic(inputObject) {
    if (cloudIntegration.MODULE_PRIVILEGES_HELPER.isAdmin()) {
        var data = await cloudIntegration.SURVEY_REPOSITORY.createSurvey(inputObject.businessObject);
        return {
            executionSuccessful: true,
            data
        }
    } else {
        return {
            executionSuccessful: false,
            requestedActionForbidden: true,
            errorMessage: 'No privileges for requested action!'
        }
    }
}