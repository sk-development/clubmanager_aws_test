'use strict';

module.exports = class Survey {
    constructor(id, title, validTo, description, surveyOptions, sections) {
        this.id = id;
        this.title = title;
        this.validTo = validTo;
        this.description = description;
        this.surveyOptions = surveyOptions;
        this.sections = sections;
    }
}