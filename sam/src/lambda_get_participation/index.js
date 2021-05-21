//This lambda-function is for querying a single participation

var cloudIntegration = require(process.env.AWS ? '/opt/aws-integration/index' : '../layers/aws-integration/index');

exports.handler = async (event) => {
    // event mit einer separaten Methode im Adapter auspacken
    return await cloudIntegration.LAMBDA_PROXY_ADAPTER.handleAsync(businessLogic, event);
};

async function businessLogic(event) {
    // auf dieser Ebene kein try-catch sondern data validation
    try {
        if (!event['pathParameters']) {
            var data = await cloudIntegration.SURVEY_REPOSITORY.getSurveys();
        } else {
            // hier gleich die ID rein
            var data = await cloudIntegration.SURVEY_REPOSITORY.getSurvey(event);
        }
        return {
            executionSuccessful: true,
            data
        }
    } catch (err) {
        return {
            executionSuccessful: false,
            err
        }
    }
}