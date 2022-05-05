'use strict';

module.exports = class ValidationRun {

    constructor() {}

    _validationContext = {};
    _validations = [];
    valid = true;

    async execute() {
        for(const validation of this._validations) {
            if(!await validation.execute())
                this.valid = false;
        }
        return this.valid
    }

    entryExists(inputObject, repository) {
        this.entryExistsForProperty(inputObject, "id", repository);
    }

    entryExistsForProperty(inputObject, propertyName, repository) {
        this._initValidationStep(new EntryExistsValidation(inputObject, propertyName, repository));
    }

    requiredProperty(inputObject, propertyName) {
        this._initValidationStep(new RequiredPropertyValidation(inputObject, propertyName));
    }

    requiredPropertyWithType(inputObject, propertyName, type) {
        this._initValidationStep(new RequiredPropertyValidation(inputObject, propertyName, type));
    }

    validCrossProperty(inputObject, crossIdentificator, propertyName, crossPropertyName) {
        this._initValidationStep(new ValidCrossPropertyValidation(inputObject, crossIdentificator, propertyName, crossPropertyName))
    }

    validDate(inputObject, propertyName) {
        this._initValidationStep(new ValidDateValidation(inputObject, propertyName));
    }

    _initValidationStep(validator) {
        this._validations.push(new ValidationStep(this._validationContext, validator));
    }
}

class ValidationStep {
    constructor(validationContext, validator) {
        this.valid = true;
        this.validationContext = validationContext;
        this.validator = validator;
    }

    async execute() {
        this.valid = this.validator.execute(this.validationContext);
        return this.valid;
    }
}

class EntryExistsValidation {
    constructor(inputObject, propertyName, repository) {
        this.inputObject = inputObject;
        this.propertyName = propertyName;
        this.repository = repository;
    }

    async execute(validationContext) {
        const propertyValue = this.inputObject[this.propertyName];
        if(propertyValue == null)
            return false;
        if(!checkUuid(propertyValue))
            return false;
        
        const existingEntry = await this.repository.getById(propertyValue);
        if(existingEntry == null)
            return false;
        
        validationContext[this.propertyName + "_object"] = existingEntry;
        return true;
    }
}

class RequiredPropertyValidation {
    constructor(inputObject, propertyName, type) {
        this.inputObject = inputObject;
        this.propertyName = propertyName;
        this.type = type;
    }

    async execute(validationContext) {
        const propertyValue = this.inputObject[this.propertyName];
        if(propertyValue == null)
            return false;
        // TODO: Validate the type of the property value
        
        return true;
    }
}

class ValidDateValidation {
    constructor(inputObject, propertyName) {
        this.inputObject = inputObject;
        this.propertyName = propertyName;
    }

    async execute(validationContext) {
        const propertyValue = this.inputObject[this.propertyName];
        if(propertyValue == null)
            return true;
        return checkDateForUTC(propertyValue);
    }
}

class ValidCrossPropertyValidation {
    constructor(inputObject, crossIdentificator, propertyName, crossPropertyName) {
        this.inputObject = inputObject;
        this.crossIdentificator = crossIdentificator;
        this.propertyName = propertyName;
    }

    async execute(validationContext) {
        const crossObject = validationContext[this.crossIdentificator + "_object"];
        if(crossObject == null)
            // shall we here return false by default or try to reload the crossObject (at this moment the survey)
            // but if the "crossObject" is null, something must have gone wrong in the entryExistsForProperty-Validation
            return false;
        for (const property of this.propertyName) {
            var propertyIsValid = false;
            for (const crossProperts of this.crossPropertyName) {
                // if match: propertyIsValid = true and continue;
            }
            if (!propertyIsValid)
                return false;
        }
        return true;
    }
}

function checkUuid(id) {
    // ggf. the ignore case i at the end of the regex has to be added again
    const uuidV4Regex = /^[A-Fa-f\d]{8}-[A-Fa-f\d]{4}-4[A-Fa-f\d]{3}-[89ABab][A-Fa-f\d]{3}-[A-Fa-f\d]{12}$/;
    if (uuidV4Regex.test(id) == true || id == null) {
        return true;
    } else {
        return false;
    }
}

function checkDateForUTC(propertyValue) {
    const utcDateRegex = /^[0-9]{4}-[0-9]{2}-[0-9]{2}T[0-9]{2}:[0-9]{2}:[0-9]{2}.[0-9]{3}\+[0-9]{2}:[0-9]{2}$/;
    return utcDateRegex.test(propertyValue);
}