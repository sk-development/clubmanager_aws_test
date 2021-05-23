//This lambda-function is for querying multiple participations

var cloudIntegration = require(process.env.AWS ? '/opt/aws-integration/index' : '../layers/aws-integration/index');

exports.handler = async (event) => {
    // event mit einer separaten Methode im Adapter auspacken
    return await cloudIntegration.LAMBDA_PROXY_ADAPTER.handleAsync(businessLogic, event);
};

async function businessLogic(event) {
    // auf dieser Ebene kein try-catch sondern data validation
        if (!event['pathParameters']) {
            var data = await cloudIntegration.PARTICIPATION_REPOSITORY.getAllParticipations();
        } else {
            const uuidV4Regex = /^[A-F\d]{8}-[A-F\d]{4}-4[A-F\d]{3}-[89AB][A-F\d]{3}-[A-F\d]{12}$/i;
            if(event['pathParameters']['userID']) {
                var userId = event['pathParameters']['userID'];
                if (true/*uuidV4Regex.test(userId)*/) {
                    var data = await cloudIntegration.PARTICIPATION_REPOSITORY.getUserParticipations(userId);
                } else {
                    return {
                        executionSuccessful: false,
                    }
                }
            }
            if(event['pathParameters']['surveyID']) {
                var surveyId = event['pathParameters']['surveyID'];
                if (uuidV4Regex.test(surveyId)) {
                    var data = await cloudIntegration.PARTICIPATION_REPOSITORY.getSurveyParticipations(surveyId);
                } else {
                    return {
                        executionSuccessful: false,
                    }
                }
            }
            if(event['pathParameters']['participationID']) {
                var participationId = event['pathParameters']['participationID'];
                if (uuidV4Regex.test(participationId)) {
                    var data = await cloudIntegration.PARTICIPATION_REPOSITORY.getParticipationById(participationId);
                } else {
                    return {
                        executionSuccessful: false,
                    }
                }
            }
        }
        return {
            executionSuccessful: true,
            data
        }
}