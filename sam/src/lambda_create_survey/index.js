var cloudIntegration = require(process.env.AWS ? '/opt/aws-integration/index' : '../layers/aws-integration/index');

// old version
// exports.handler = async (event) => {
//     return await cloudIntegration.LAMBDA_PROXY_ADAPTER.handleAsync(businessLogic, event);
// };

// async function businessLogic(event) {
//     if (cloudIntegration.MODULE_PRIVILEGES_HELPER.isAdmin()) {
//         var data = await cloudIntegration.SURVEY_REPOSITORY.createSurvey(event);
//         return {
//             executionSuccessful: true,
//             data
//         }
//     } else {
//         return {
//             executionSuccessful: false,
//             errorMessage: 'No priviliges for requested action!'
//         }
//     }
// }

// new version
exports.handler = async (event) => {
    return await cloudIntegration.LAMBDA_PROXY_ADAPTER.handleAsync(prepareInput, businessLogic, event);
}

class InputObject {
    constructor(businessObject, userID, surveyID, participationID) {
        this.businessObject = businessObject;
        this.userID = userID;
        this.surveyID = surveyID;
        this.participationID = participationID;
    }
}

function prepareInput(event) {
    var surveyData = cloudIntegration.EVENT_HELPER.getSurveyData(event);
    return new InputObject(surveyData, null, null, null);
}

async function businessLogic(inputObject) {
    if (cloudIntegration.MODULE_PRIVILEGES_HELPER.isAdmin()) {
        var data = await cloudIntegration.SURVEY_REPOSITORY.createSurvey(inputObject.businessObject);
        return {
            executionSuccessful: true,
            data
        }
    } else {
        return {
            executionSuccessful: false,
            errorMessage: 'No privileges for requested action!'
        }
    }
}