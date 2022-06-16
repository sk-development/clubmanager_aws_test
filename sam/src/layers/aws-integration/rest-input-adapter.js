'use strict';

const Survey = require('./models/survey');
const Participation = require('./models/participation');

module.exports = class RestInputAdapter {
    X_APIKEY = "X-Apikey"

    constructor() {}

    extractHeaderValues(event, names, headerValues) {
        for (const name of names) {
            const value = event.headers[name];
            if (value != null) {
                headerValues[name] = value;
            }
            else {
                return false;
            }
        }
        return true;
    }

    convertSurveyId(event) {
        return { id: this._getIndividualPathParameter(event, "surveyID") }
    }

    convertParticipationId(event) {
        return { id: this._getIndividualPathParameter(event, "participationID") }
    }

    convertAllParticipationPathIds(event) {
        return {
            id: this._getIndividualPathParameter(event, "participationID"),
            // surveyId: this._getIndividualPathParameter(event, "surveyID"), // TODO not needed anymore?
            userId: this._getIndividualPathParameter(event, "userID")
        }
    }

    convertSurvey(event) {
        const data = this._parseEventData(event);
        if(data==null)
            return null;
            return new Survey(this.convertSurveyId(event).id, data.title, data.validTo, data.description, data.options, data.sections);
    }
    
    convertParticipation(event) {
        const data = this._parseEventData(event);
        if(data==null)
            return null;
        const convertedPathParameter = this.convertParticipationId(event);
        return new Participation(
            convertedPathParameter.id, data.userId, data.surveyId, data.notation, data.editedOptionsObjectArray);
    }

    _parseEventData(event) {
        return JSON.parse(event.body);
    }

    _getIndividualPathParameter(event, pathParameter) {
        const pathParameters = event['pathParameters'];
        console.log(event['pathParameters'])
        if (pathParameters == null) {
            return null;
        } else {
            return pathParameters[pathParameter];
        }
    }

    //WIP
}