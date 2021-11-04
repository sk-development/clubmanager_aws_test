var cloudIntegration = require(process.env.AWS ? '/opt/aws-integration/index' : '../layers/aws-integration/index');

exports.handler = async (event) => {
    return await cloudIntegration.LAMBDA_PROXY_ADAPTER.handleAsync(businessLogic, event);
};

async function businessLogic(event) {
    if (cloudIntegration.MODULE_PRIVILEGES_HELPER.isUser()) {
        const uuidV4Regex = /^[A-F\d]{8}-[A-F\d]{4}-4[A-F\d]{3}-[89AB][A-F\d]{3}-[A-F\d]{12}$/i;
        var participationId = event['pathParameters']['participationID'];
        if (uuidV4Regex.test(participationId)) {
            var data = await cloudIntegration.PARTICIPATION_REPOSITORY.updateParticipation(event);
        } else {
            return {
                executionSuccessful: false,
                errorMessage: 'ParticipationID invalid!'
            }
        }
        return {
            executionSuccessful: true,
            data
        }
    }
    return {
        executionSuccessful: false,
        errorMessage: 'No priviliges for requested action!'
    }
}

