var cloudIntegration = require(process.env.AWS ? '/opt/aws-integration/index' : '../layers/aws-integration/index');

exports.handler = async (event) => {
    return await cloudIntegration.LAMBDA_PROXY_ADAPTER.handleAsync(businessLogic, event);
};

async function businessLogic(event) {
    if (cloudIntegration.MODULE_PRIVILEGES_HELPER.isAdmin()) {
        var data = await cloudIntegration.SURVEY_REPOSITORY.createSurvey(event);
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