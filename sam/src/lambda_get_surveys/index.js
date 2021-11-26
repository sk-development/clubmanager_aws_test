var cloudIntegration = require(process.env.AWS ? '/opt/aws-integration/index' : '../layers/aws-integration/index');

exports.handler = async (event) => {
    // event mit einer separaten Methode im Adapter auspacken
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
    var surveyData = cloudIntegration.EVENT_HELPER.getSurveyData(event);
    var surveyIDPathParameter = cloudIntegration.EVENT_HELPER.getIndividualPathParameter(event, 'surveyID')
    if (cloudIntegration.EVENT_HELPER.checkUuid(surveyIDPathParameter)) {
        return new InputObject(surveyData, null, surveyIDPathParameter, null);
    } else {
        return {
            executionSuccessful: false,
            errorMessage: 'SurveyID invalid'
        }
    }
}

// old version
// async function businessLogic(event) {
//     if (cloudIntegration.MODULE_PRIVILEGES_HELPER.isUser()) {
//         if (!event['pathParameters']) {
//             var data = await cloudIntegration.SURVEY_REPOSITORY.getSurveys();
//         } else {
//             // hier gleich die ID rein
//             const uuidV4Regex = /^[A-F\d]{8}-[A-F\d]{4}-4[A-F\d]{3}-[89AB][A-F\d]{3}-[A-F\d]{12}$/i;
//             var surveyId = event['pathParameters']['surveyID'];
//             if (uuidV4Regex.test(surveyId)) {
//                 var data = await cloudIntegration.SURVEY_REPOSITORY.getSurvey(surveyId);
//             } else {
//                 return {
//                     executionSuccessful: false,
//                     errorMessage: 'SurveyID invalid!'
//                 }
//             }
//         }
//         return {
//             executionSuccessful: true,
//             data
//         }
//     }
//     return {
//         executionSuccessful: false,
//         errorMessage: 'No priviliges for requested action!'
//     }
// }

// new version
async function businessLogic(inputObject) {
    if (cloudIntegration.MODULE_PRIVILEGES_HELPER.isUser()) {
        if (inputObject.surveyID == null) {
            var data = await cloudIntegration.SURVEY_REPOSITORY.getSurveys();
        } else {
            var data = await cloudIntegration.SURVEY_REPOSITORY.getSurvey(surveyId);
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