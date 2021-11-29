var cloudIntegration = require(process.env.AWS ? '/opt/aws-integration/index' : '../layers/aws-integration/index');

exports.handler = async (event) => {
    // event mit einer separaten Methode im Adapter auspacken
    return await cloudIntegration.LAMBDA_PROXY_ADAPTER.handleAsync(prepareInput, businessLogic, event);
};

class InputObject {
    constructor(businessObject, surveyID) {
        this.businessObject = businessObject;
        this.surveyID = surveyID;
    }
}

function prepareInput(event) {
    // old version
    // var surveyIDPathParameter = cloudIntegration.EVENT_HELPER.getIndividualPathParameter(event, 'surveyID')
    // if (event.body != null) {
    //     var surveyData = cloudIntegration.EVENT_HELPER.getSurveyData(event);
    //     if (cloudIntegration.EVENT_HELPER.checkUuid(surveyIDPathParameter)) {
    //         return new InputObject(surveyData, null, surveyIDPathParameter, null);
    //     } else {
    //         return {
    //             executionSuccessful: false,
    //             errorMessage: 'SurveyID invalid'
    //         }
    //     }
    // } else {
    //     return new InputObject(null, null, surveyIDPathParameter, null);
    // }
    // new version
    var surveyIDPathParameter = cloudIntegration.EVENT_HELPER.getIndividualPathParameter(event, 'surveyID');
    var surveyData = cloudIntegration.EVENT_HELPER.getSurveyData(event);
    // if (cloudIntegration.EVENT_HELPER.checkUuid(surveyIDPathParameter)) { // check Uuid in businessLogic function 
    if (surveyData == null) {
        return new InputObject(null, surveyIDPathParameter);
    } else {
        return new InputObject(surveyData, surveyIDPathParameter);
    }
    // } else {
    //     return {
    //         executionSuccessful: false,
    //         errorMessage: 'SurveyID invalid'
    //     }
    // }
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
            if (cloudIntegration.EVENT_HELPER.checkUuid(inputObject.surveyID)) {
                var data = await cloudIntegration.SURVEY_REPOSITORY.getSurvey(inputObject.surveyID);
            } else {
                return {
                    executionSuccessful: false,
                    errorMessage: 'SurveyID invalid'
                }
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