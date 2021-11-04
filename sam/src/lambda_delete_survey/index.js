cloudIntegration = require(process.env.AWS ? '/opt/aws-integration/index' : '../layers/aws-integration/index');

exports.handler = async (event) => {
    return await cloudIntegration.LAMBDA_PROXY_ADAPTER.handleAsync(businessLogic, event);
};

async function businessLogic(event) {
    if (cloudIntegration.MODULE_PRIVILEGES_HELPER.isAdmin()) {
        const uuidV4Regex = /^[A-F\d]{8}-[A-F\d]{4}-4[A-F\d]{3}-[89AB][A-F\d]{3}-[A-F\d]{12}$/i;
        var surveyId = event['pathParameters']['surveyID'];
        if (uuidV4Regex.test(surveyId)) {
            var data = await cloudIntegration.SURVEY_REPOSITORY.deleteSurvey(event);
        } else {
            return {
                executionSuccessful: false,
                errorMessage: 'SurveyID invalid!'
            }
        }
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
