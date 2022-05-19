'use strict';

const authorizationService = require('./authorization.service')
const RestInputAdapter = require('./rest-input-adapter');
const ValidationRun = require('./validation/validation-run');

async function handleAsync(prepareInputCallback, requiredPrivilegesCallback, validationCallback, businessLogicCallback, event) {
    let handledResult;
    try {
        const processChain = new ProcessChain();

        if (process.env.AWS_SAM_LOCAL == 'true')
            processChain.addStep(new ProcessStepLocalAuthorizer());
        if (prepareInputCallback != null)
            processChain.addStep(new ProcessStepPrepareInput(prepareInputCallback));
        if (requiredPrivilegesCallback != null)
            processChain.addStep(new ProcessStepRequiredPrivileges(requiredPrivilegesCallback));
        if (validationCallback != null)
            processChain.addStep(new ProcessStepValidation(validationCallback));
        processChain.addStep(new ProcessStepBusinessLogic(businessLogicCallback));

        handledResult = await processChain.execute(event);
    }
    catch (err) {
        console.log(err);
        handledResult = {
            statusCode: 500,
            data: err
        }
    }
    return packageHttpResponse(handledResult);
}

class ProcessChain {
    constructor() { }
    _steps = [];
    _context = new ProcessContext();

    addStep(processStep) {
        this._steps.push(processStep);
    }

    async execute(event) {
        this._context._event = event;
        let stepResult = null;
        for (const step of this._steps) {
            if (stepResult == null)
                stepResult = await step.execute(this._context);
        }
        return stepResult;
    }
}

class ProcessContext {
    constructor() { }
    _event = null;
    _preparedInput = null;
}

class ProcessStepLocalAuthorizer {
    constructor() { }

    async execute(context) {
        const successful = await this.runLocalAuthorizer(context._event);
        return (successful) ? null : {
            statusCode: 403,
            data: "Authorization failed!"
        };
    }

    async runLocalAuthorizer(event) {
        let successful = false;
        const inputAdapter = new RestInputAdapter();
        const headerValues = {}
        if (inputAdapter.extractHeaderValues(event, [inputAdapter.X_APIKEY], headerValues)) {
            const authorizationResult = await authorizationService.authorize(headerValues[inputAdapter.X_APIKEY]);
            if (authorizationResult.policyDocument.Statement[0].Effect == "Allow") {
                if (authorizationResult.context == null)
                    authorizationResult.context = {}
                event.requestContext.authorizer = authorizationResult.context;
                successful = true;
            }
        }
        return Promise.resolve(successful);
    }
}

class ProcessStepPrepareInput {
    constructor(callback) {
        this.callback = callback;
    }

    async execute(context) {
        context._preparedInput = this.callback(context._event);
    }
}

class ProcessStepRequiredPrivileges {
    constructor(callback) {
        this.callback = callback;
    }

    async execute(context) {
        const requiredPrivileges = this.callback(context._preparedInput);
        if (requiredPrivileges != null) {
            const authorizerContext = context._event.requestContext.authorizer;
            const grantedTenantPrivileges = JSON.parse(authorizerContext.tenantPrivileges);
            const grantedModulePrivileges = JSON.parse(authorizerContext.modulePrivileges);
            if (!requiredPrivileges.verify(grantedTenantPrivileges, grantedModulePrivileges)) return {
                statusCode: 403,
                data: "Authorization failed"
            }
        }
    }
}

class ProcessStepValidation {
    constructor(callback) {
        this.callback = callback;
    }

    async execute(context) {
        const validationRun = new ValidationRun();
        this.callback(context._preparedInput, validationRun);
        if (!await validationRun.execute()) return {
            statusCode: 400,
            data: "Invalid input"
        }
        // TODO: provide details from validation steps in response    
    }
}

class ProcessStepBusinessLogic {
    constructor(callback) {
        this.callback = callback;
    }

    async execute(context) {
        const result = await this.callback(context._preparedInput);
        return this.handleResult(result);
    }

    handleResult(result) {
        if (result.executionSuccessful)
            return {
                statusCode: 200,
                data: result.data
            }
        else
            return {
                statusCode: 500
            }
    }
}

function packageHttpResponse(handledResult) {
    return {
        statusCode: handledResult.statusCode,
        headers: {
            "Access-Control-Allow-Origin": "*",
            // "Access-Control-Allow-Methods": "'OPTIONS,POST,GET'",
            // "Access-Control-Allow-Headers": "'Content-Type, x-apikey, x-tenantid'"
        },
        body: (handledResult.data != null) ? JSON.stringify(handledResult.data) : ""
    }
}

module.exports = {
    handleAsync: handleAsync
};