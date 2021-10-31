var cloudIntegration = require(process.env.AWS ? '/opt/aws-integration/index' : '../layers/aws-integration/index');

exports.handler = async (event) => {
    return await cloudIntegration.LAMBDA_PROXY_ADAPTER.handleAsync(businessLogic, event);
};

async function businessLogic(event) {
    const globalAdmin = event.requestContext.authorizer.isGlobalAdmin;
    const modulePrivileges = event.requestContext.authorizer.modulePrivileges;
    if (globalAdmin == 'true' || modulePrivileges == 'admin') {
        var data = await cloudIntegration.SURVEY_REPOSITORY.createSurvey(event);
        return {
            executionSuccessful: true,
            data
        }
    } else {
        return {
            executionSuccessful: false,
            data
        }
    }
}