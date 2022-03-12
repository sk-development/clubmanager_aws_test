'use strict';

module.exports = class Survey {
    constructor(id, title, validTo, description, options, sections) {
        this.id = id;
        this.title = title;
        this.validTo = validTo;
        this.description = description;
        this.options = options;
        this.sections = sections;
    }
}