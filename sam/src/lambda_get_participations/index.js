//This lambda-function is for querying multiple participations

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
    var userIDPathParameter = cloudIntegration.EVENT_HELPER.getIndividualPathParameter(event, 'userID');
    if (event.body != null) {
        var participationIDPathParameter = cloudIntegration.EVENT_HELPER.getIndividualPathParameter(event, 'participationID');
        var surveyIDPathParameter = cloudIntegration.EVENT_HELPER.getIndividualPathParameter(event, 'surveyID');
        var participationData = cloudIntegration.EVENT_HELPER.getParticipationData(event);
        if (cloudIntegration.EVENT_HELPER.checkUuid(surveyIDPathParameter) && cloudIntegration.EVENT_HELPER.checkUuid(userIDPathParameter && cloudIntegration.EVENT_HELPER.checkUuid(participationIDPathParameter))) {
            return new InputObject(participationData, userIDPathParameter, surveyIDPathParameter, participationIDPathParameter);
        } else {
            return {
                executionSuccessful: false,
                errorMessage: 'Input ID invalid'
            }
        }
    } else {
        return new InputObject(null, userIDPathParameter, null, null);
    }
}


// function prepareInput(event){
    // return js object (path parameter, survey/participatin, userId, surveyId als properties udn darauf aufbauend in der businessLogic die Abfrage für die unterschiedlichen Aufrufe machen...) for businessLogic function
// }

// old version
// async function businessLogic(event) { //insert prepareInput object instead of event
//     if (cloudIntegration.MODULE_PRIVILEGES_HELPER.isUser()) {
//         if (!event['pathParameters']) {
//             if (cloudIntegration.MODULE_PRIVILEGES_HELPER.isAdmin()) {
//                 var data = await cloudIntegration.PARTICIPATION_REPOSITORY.getAllParticipations();
//             } else {
//                 return {
//                     executionSuccessful: false,
//                     errorMessage: 'No priviliges for requested action!'
//                 } 
//             }
//         } else {
//             const uuidV4Regex = /^[A-F\d]{8}-[A-F\d]{4}-4[A-F\d]{3}-[89AB][A-F\d]{3}-[A-F\d]{12}$/i;
//             if(event['pathParameters']['userID']) {
//                 var userId = event['pathParameters']['userID'];
//                 if (true/*uuidV4Regex.test(userId)*/) {
//                     var data = await cloudIntegration.PARTICIPATION_REPOSITORY.getUserParticipations(userId);
//                 } else {
//                     return {
//                         executionSuccessful: false,
//                     }
//                 }
//             }
//             if(event['pathParameters']['surveyID']) {
//                 if (cloudIntegration.MODULE_PRIVILEGES_HELPER.isAdmin()) {
//                     var surveyId = event['pathParameters']['surveyID'];
//                     if (uuidV4Regex.test(surveyId)) {
//                         var data = await cloudIntegration.PARTICIPATION_REPOSITORY.getSurveyParticipations(surveyId);
//                     } else {
//                         return {
//                             executionSuccessful: false,
//                             errorMessage: 'SurveyID invalid!'
//                         }
//                     }
//                 } else {
//                     return {
//                         executionSuccessful: false,
//                         errorMessage: 'No priviliges for requested action!'
//                     }
//                 }
//             }
//             if(event['pathParameters']['participationID']) {
//                 var participationId = event['pathParameters']['participationID'];
//                 if (uuidV4Regex.test(participationId)) {
//                     var data = await cloudIntegration.PARTICIPATION_REPOSITORY.getParticipationById(participationId);
//                 } else {
//                     return {
//                         executionSuccessful: false,
//                         errorMessage: 'ParticipationID invalid!'
//                     }
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


//new version
async function businessLogic(inputObject) { //insert prepareInput object instead of event
    if (cloudIntegration.MODULE_PRIVILEGES_HELPER.isUser()) {
        if (inputObject.userID != null && inputObject.surveyID == null && inputObject.participationID == null) {
            if (cloudIntegration.MODULE_PRIVILEGES_HELPER.isAdmin()) {
                var data = await cloudIntegration.PARTICIPATION_REPOSITORY.getAllParticipations();
            } else {
                return {
                    executionSuccessful: false,
                    errorMessage: 'No priviliges for requested action!'
                }
            }
        } else {
            if (inputObject.userID != null) {
                var data = await cloudIntegration.PARTICIPATION_REPOSITORY.getUserParticipations(userId);
            }
            if (inputObject.surveyID != null) {
                if (cloudIntegration.MODULE_PRIVILEGES_HELPER.isAdmin()) {
                    var data = await cloudIntegration.PARTICIPATION_REPOSITORY.getSurveyParticipations(surveyId);
                }
            } else {
                return {
                    executionSuccessful: false,
                    errorMessage: 'No priviliges for requested action!'
                }
            }
            if (inputObject.participationID == null) {

                var data = await cloudIntegration.PARTICIPATION_REPOSITORY.getParticipationById(participationId);
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