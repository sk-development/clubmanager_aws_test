var cloudIntegration = require(process.env.AWS ? '/opt/aws-integration/index' : '../layers/aws-integration/index');

exports.handler = async (event) => {
    var surveyId = cloudIntegration.EVENT_HELPER.getPathParameter(event, 'surveyID') // in handler function
    if (cloudIntegration.EVENT_HELPER.checkUuid(surveyId)) {
        return await cloudIntegration.LAMBDA_PROXY_ADAPTER.handleAsync(businessLogic, event); // do not pass event to businessLogic, just pass object to businessLogic
    } else {
        return {
            executionSuccessful: false,
            errorMessage: 'SurveyID invalid!'
        }
    }
};

async function businessLogic(event) {
    if (cloudIntegration.MODULE_PRIVILEGES_HELPER.isAdmin()) {
        // const uuidV4Regex = /^[A-F\d]{8}-[A-F\d]{4}-4[A-F\d]{3}-[89AB][A-F\d]{3}-[A-F\d]{12}$/i; // in handler function, define globally
        // var surveyId = event['pathParameters']['surveyID'];
        // var surveyId = cloudIntegration.EVENT_HELPER.getPathParameter(event, 'surveyID') // in handler function
        // if (uuidV4Regex.test(surveyId)) {
            // var data = await cloudIntegration.SURVEY_REPOSITORY.updateSurvey(event);
            var data = await cloudIntegration.SURVEY_REPOSITORY.updateSurvey(surveyId, cloudIntegration.EVENT_HELPER.getObjectData(event));
        // } else {
        //     return {
        //         executionSuccessful: false,
        //         errorMessage: 'SurveyID invalid!'
        //     }
        // }
        return {
            executionSuccessful: true,
            data
        }
    } else {
        return {
            executionSuccessful: false,
            errorMessage: 'No priviliges for requested action!'
        }
    }
}