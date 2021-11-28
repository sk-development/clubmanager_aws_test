var cloudIntegration = require(process.env.AWS ? '/opt/aws-integration/index' : '../layers/aws-integration/index');

// old version
// exports.handler = async (event) => {
//     var surveyId = cloudIntegration.EVENT_HELPER.getPathParameter(event, 'surveyID') // in handler function
//     if (cloudIntegration.EVENT_HELPER.checkUuid(surveyId)) {
//         return await cloudIntegration.LAMBDA_PROXY_ADAPTER.handleAsync(businessLogic, event); // do not pass event to businessLogic, just pass object to businessLogic
//     } else {
//         return {
//             executionSuccessful: false,
//             errorMessage: 'SurveyID invalid!'
//         }
//     }
// };

// async function businessLogic(event) {
//     if (cloudIntegration.MODULE_PRIVILEGES_HELPER.isAdmin()) {
//         // const uuidV4Regex = /^[A-F\d]{8}-[A-F\d]{4}-4[A-F\d]{3}-[89AB][A-F\d]{3}-[A-F\d]{12}$/i; // in handler function, define globally
//         // var surveyId = event['pathParameters']['surveyID'];
//         // var surveyId = cloudIntegration.EVENT_HELPER.getPathParameter(event, 'surveyID') // in handler function
//         // if (uuidV4Regex.test(surveyId)) {
//             // var data = await cloudIntegration.SURVEY_REPOSITORY.updateSurvey(event);
//             var data = await cloudIntegration.SURVEY_REPOSITORY.updateSurvey(surveyId, cloudIntegration.EVENT_HELPER.getObjectData(event));
//         // } else {
//         //     return {
//         //         executionSuccessful: false,
//         //         errorMessage: 'SurveyID invalid!'
//         //     }
//         // }
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
    var surveyIDPathParameter = cloudIntegration.EVENT_HELPER.getIndividualPathParameter(event, 'surveyID');
    var surveyData = cloudIntegration.EVENT_HELPER.getSurveyData(event);
    if (cloudIntegration.EVENT_HELPER.checkUuid(surveyIDPathParameter)) {
        return new InputObject(surveyData, null, surveyIDPathParameter, null);
    } else {
        return {
            executionSuccessful: false,
            errorMessage: 'SurveyID invalid'
        }
    }
}

async function businessLogic(inputObject) {
    if (cloudIntegration.MODULE_PRIVILEGES_HELPER.isAdmin()) {
        var data = await cloudIntegration.SURVEY_REPOSITORY.updateSurvey(inputObject.surveyID, inputObject.businessObject);
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