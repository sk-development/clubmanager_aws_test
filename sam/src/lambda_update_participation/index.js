var cloudIntegration = require(process.env.AWS ? '/opt/aws-integration/index' : '../layers/aws-integration/index');

exports.handler = async (event) => {
    return await cloudIntegration.LAMBDA_PROXY_ADAPTER.handleAsync(prepareInput, businessLogic, event);
}

class InputObject {
    constructor(businessObject, participationID) {
        this.businessObject = businessObject;
        this.participationID = participationID;
    }
}

function prepareInput(event) {
    console.log(JSON.stringify(event.body))
    var participationIDPathParameter = cloudIntegration.EVENT_HELPER.getIndividualPathParameter(event, 'participationID');
    var participationData = cloudIntegration.EVENT_HELPER.getParticipationData(event);
    return new InputObject(participationData, participationIDPathParameter);
}

async function businessLogic(inputObject) {
    if (cloudIntegration.MODULE_PRIVILEGES_HELPER.isUser()) {
        if (cloudIntegration.EVENT_HELPER.checkUuid(inputObject.participationID)) {
            var data = await cloudIntegration.PARTICIPATION_REPOSITORY.updateParticipation(inputObject.participationID, inputObject.businessObject);
            return {
                executionSuccessful: true,
                data
            }
        } else {
            return {
                executionSuccessful: false,
                errorMessage: 'ParticipationID invalid!'
            }
        }
    } else {
        return {
            executionSuccessful: false,
            requestedActionForbidden: true,
            errorMessage: 'No priviliges for requested action!'
        }
    }
}