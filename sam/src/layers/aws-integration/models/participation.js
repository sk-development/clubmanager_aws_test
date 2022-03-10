'use strict';

module.exports = class Participation {
    constructor(participationId, userId, surveyId, notation, editedOptionsObjectArray) {
        this.participationId = participationId;
        this.userId = userId;
        this.surveyId = surveyId;
        this.notation = notation;
        this.editedOptionsObjectArray = editedOptionsObjectArray;
    }
}