var cloudIntegration = require(process.env.AWS ? '/opt/aws-integration/index' : '../layers/aws-integration/index');

exports.handler = async (event) => {
    return await cloudIntegration.LAMBDA_PROXY_ADAPTER.handleAsync(prepareInput, businessLogic, event);
};

class InputObject {
    constructor(businessObject, surveyID) {
        this.businessObject = businessObject;
        this.surveyID = surveyID;
    }
}

function prepareInput(event) {
    var surveyIDPathParameter = cloudIntegration.EVENT_HELPER.getIndividualPathParameter(event, 'surveyID');
    var surveyData = cloudIntegration.EVENT_HELPER.getSurveyData(event);
    if (surveyData == null) {
        return new InputObject(null, surveyIDPathParameter);
    } else {
        return new InputObject(surveyData, surveyIDPathParameter);
    }
}

async function businessLogic(inputObject) {
    if (cloudIntegration.MODULE_PRIVILEGES_HELPER.isUser()) {
        if (inputObject.surveyID == null) {
            var data = await cloudIntegration.SURVEY_REPOSITORY.getSurveys();
        } else {
            if (cloudIntegration.EVENT_HELPER.checkUuid(inputObject.surveyID)) {
                var data = await cloudIntegration.SURVEY_REPOSITORY.getSurvey(inputObject.surveyID);
            } else {
                return {
                    executionSuccessful: false,
                    errorMessage: 'SurveyID invalid'
                }
            }
        }
        return {
            executionSuccessful: true,
            data
        }
    }
    return {
        executionSuccessful: false,
        requestedActionForbidden: true,
        errorMessage: 'No priviliges for requested action!'
    }
}