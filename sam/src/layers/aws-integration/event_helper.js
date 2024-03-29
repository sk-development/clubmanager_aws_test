// survey class
class Survey {
    constructor(id, title, validTo, description, options, sections) {
        this.id = id;
        this.title = title;
        this.validTo = validTo;
        this.description = description;
        this.options = options;
        this.sections = sections;
    }
}
// participation class
class Participation {
    constructor(participationId, userId, surveyId, notation, editedOptionsObjectArray) {
        this.participationId = participationId;
        this.userId = userId;
        this.surveyId = surveyId;
        this.notation = notation;
        this.editedOptionsObjectArray = editedOptionsObjectArray;
    }
}

// function getAllPathParameters(event) {
//     // return event['pathParameters'][pathParameter];
//     return event['pathParameters'];
// }

function getIndividualPathParameter(event, pathParameter) {
    if (event['pathParameters'] == null) {
        return null;
    } else {
        return event['pathParameters'][pathParameter];
    }
}

function checkUuid(id) {
    const uuidV4Regex = /^[A-F\d]{8}-[A-F\d]{4}-4[A-F\d]{3}-[89AB][A-F\d]{3}-[A-F\d]{12}$/i; // in handler function, define globally
    if (uuidV4Regex.test(id) == true || id == null) {
        return true;
    } else {
        return false;
    }
}

function getObjectData(event) {
    return JSON.parse(event.body);
}

function getSurveyData(event) {
    var data = getObjectData(event);
    if (data != null) {
        if (data.id == null) {
            return new Survey(null, data.title, data.validTo, data.description, data.options, data.sections);
        } else {
            return new Survey(data.id, data.title, data.validTo, data.description, data.options, data.sections);
        }
    } else {
        return null;
    }
    // TODO
    // do validation if necessary
    // if (data.hasOwnProperty('validTo')) { // do not do this
    // pass survey object to method to check UUID here
    // } else {
    // }
}

function getParticipationData(event) {
    var data = getObjectData(event);
    if(data != null) {
        if(data.participationId == null) {
            return new Participation(null, data.userId, data.surveyId, data.notation, data.editedOptionsObjectArray);
        } else {
            return new Participation(data.participationId, data.userId, data.surveyId, data.notation, data.editedOptionsObjectArray);
        }
    } else {
        return null;
    }
}

module.exports = {
    // getAllPathParameters: getAllPathParameters,
    getIndividualPathParameter: getIndividualPathParameter,
    checkUuid: checkUuid,
    getSurveyData: getSurveyData,
    getParticipationData: getParticipationData
}