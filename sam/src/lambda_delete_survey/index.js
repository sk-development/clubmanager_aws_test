cloudIntegration = require(process.env.AWS ? '/opt/aws-integration/index' : '../layers/aws-integration/index');

exports.handler = async (event) => {
    return await cloudIntegration.LAMBDA_PROXY_ADAPTER.handleAsync(prepareInput, businessLogic, event);
}

class InputObject {
    constructor(surveyID) {
        this.surveyID = surveyID;
    }
}

function prepareInput(event) {
    var surveyIDPathParameter = cloudIntegration.EVENT_HELPER.getIndividualPathParameter(event, 'surveyID');
    return new InputObject(surveyIDPathParameter);
}

async function businessLogic(inputObject) {
    if (cloudIntegration.MODULE_PRIVILEGES_HELPER.isAdmin()) {
        if (cloudIntegration.EVENT_HELPER.checkUuid(inputObject.surveyID)) {
            var data = await cloudIntegration.SURVEY_REPOSITORY.deleteSurvey(inputObject.surveyID);
            return {
                executionSuccessful: true,
                data
            }
        } else {
            return {
                executionSuccessful: false,
                errorMessage: 'SurveyID invalid'
            }
        }
    } else {
        return {
            executionSuccessful: false,
            requestedActionForbidden: true,
            errorMessage: 'No privileges for requested action!'
        }
    }
}