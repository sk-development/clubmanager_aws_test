var cloudIntegration = require(process.env.AWS ? '/opt/aws-integration/index' : '../layers/aws-integration/index');

exports.handler = async (event) => {
    return await cloudIntegration.LAMBDA_PROXY_ADAPTER.handleAsync(businessLogic, event);
};

async function businessLogic(event) {
    var data = await cloudIntegration.PARTICIPATION_REPOSITORY.updateParticipation(event);
    return {
        executionSuccessful: true,
        data
    }
}

