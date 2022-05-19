var cloudIntegration = require(process.env.AWS ? '/opt/aws-integration/index' : '../layers/aws-integration/index');

exports.handler = async (event) => {
    return await cloudIntegration.LAMBDA_PROXY_ADAPTER.handleAsync(prepareInput, businessLogic, event);
};

class InputObject {
    constructor(businessObject, userID, surveyID, participationID) {
        this.businessObject = businessObject;
        this.userID = userID;
        this.surveyID = surveyID;
        this.participationID = participationID;
    }
}

function prepareInput(event) {
    var userIDPathParameter = cloudIntegration.EVENT_HELPER.getIndividualPathParameter(event, 'userID');
    var surveyIDPathParameter = cloudIntegration.EVENT_HELPER.getIndividualPathParameter(event, 'surveyID');
    var participationIDPathParameter = cloudIntegration.EVENT_HELPER.getIndividualPathParameter(event, 'participationID');
    var participationData = cloudIntegration.EVENT_HELPER.getParticipationData(event);
    if (participationData != null) {
        return new InputObject(participationData, userIDPathParameter, surveyIDPathParameter, participationIDPathParameter);
    } else {
        return new InputObject(null, userIDPathParameter, surveyIDPathParameter, participationIDPathParameter);
    }
}

async function businessLogic(inputObject) {
    if (cloudIntegration.MODULE_PRIVILEGES_HELPER.isUser()) {
        if (inputObject.userID != null) {
            var data = await cloudIntegration.PARTICIPATION_REPOSITORY.getUserParticipations(inputObject.userID);
        } else {
            if (inputObject.surveyID != null) {
                if (cloudIntegration.MODULE_PRIVILEGES_HELPER.isAdmin()) {
                    if (cloudIntegration.EVENT_HELPER.checkUuid(inputObject.surveyID)) {
                        var data = await cloudIntegration.PARTICIPATION_REPOSITORY.getSurveyParticipations(inputObject.surveyID);
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
                        errorMessage: 'No priviliges for requested action!'
                    }
                }
            } else {
                if (inputObject.participationID != null) {
                    if (cloudIntegration.EVENT_HELPER.checkUuid(inputObject.participationID)) {
                        var data = await cloudIntegration.PARTICIPATION_REPOSITORY.getParticipationById(inputObject.participationID);
                    } else {
                        return {
                            executionSuccessful: false,
                            errorMessage: 'ParticipationID invalid'
                        }
                    }
                } else {
                    if (cloudIntegration.MODULE_PRIVILEGES_HELPER.isAdmin()) {
                        var data = await cloudIntegration.PARTICIPATION_REPOSITORY.getAllParticipations();
                    } else {
                        return {
                            executionSuccessful: false,
                            requestedActionForbidden: true,
                            errorMessage: 'No priviliges for requested action!'
                        }
                    }
                }
            }
        }
        return {
            executionSuccessful: true,
            data
        }
    } else {
        return {
            executionSuccessful: false,
            requestedActionForbidden: true,
            errorMessage: 'No priviliges for requested action!'
        }
    }
}