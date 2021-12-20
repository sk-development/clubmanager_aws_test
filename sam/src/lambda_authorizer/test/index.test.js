'use strict';

const lambda = require('../index');

jest.mock('superagent');
const superagent = require('superagent');
const __defaultXApiKey = "12345";
const __defaultModuleType = "courses";

let __defaultEvent = null;
let __defaultVerificationResponse = null;

beforeEach(() => {
    superagent.__init();
    __defaultEvent = getDefaultEvent();
    __defaultVerificationResponse = getDefaultVerificationResponse();
});

it('should allow user with admin and module privileges', async () => {
    superagent.__setResult(200, __defaultVerificationResponse);
    const result = await lambda.handler(__defaultEvent);
    expectAllows(result);
});

it('should allow user with admin privileges', async () => {
    __defaultVerificationResponse.privileges.tenantModulePrivileges = [];
    superagent.__setResult(200, __defaultVerificationResponse);
    const result = await lambda.handler(__defaultEvent);
    expectAllows(result);
});

it('should allow user with multiple tenant privileges', async () => {
    __defaultVerificationResponse.privileges.tenantPrivileges[0].privileges = ["user_creation", "admin"];
    __defaultVerificationResponse.privileges.tenantModulePrivileges = [];
    superagent.__setResult(200, __defaultVerificationResponse);
    const result = await lambda.handler(__defaultEvent);
    expectAllows(result);
});

it('should allow user with module privileges', async () => {
    __defaultVerificationResponse.privileges.tenantPrivileges = [];
    superagent.__setResult(200, __defaultVerificationResponse);
    const result = await lambda.handler(__defaultEvent);
    expectAllows(result);
});

it('should deny invalid token', async () => {
    __defaultVerificationResponse.valid = false;
    superagent.__setResult(200, __defaultVerificationResponse);
    const result = await lambda.handler(__defaultEvent);
    expectDeny(result);
});

it('should deny missing module type', async () => {
    __defaultEvent.headers["module-type"] = null;
    superagent.__setResult(200, __defaultVerificationResponse);
    const result = await lambda.handler(__defaultEvent);
    expectDeny(result);
    expect(superagent.__wasCalled()).toBe(false);
});

it('should deny missing apikey and not call the verification backend', async () => {
    __defaultEvent.headers["x-apikey"] = null;
    __defaultVerificationResponse.valid = false;
    __defaultVerificationResponse.message = "";
    __defaultVerificationResponse.privileges = null;
    superagent.__setResult(200, __defaultVerificationResponse);
    const result = await lambda.handler(__defaultEvent);
    expectDeny(result);
    expect(superagent.__wasCalled()).toBe(false);
});

it('should deny if backend is not reachable', async () => {
    superagent.__setResult(404, null);
    const result = await lambda.handler(__defaultEvent);
    expectDeny(result);
});

it('should deny if backend returns error', async () => {
    superagent.__setResult(500, null);
    const result = await lambda.handler(__defaultEvent);
    expectDeny(result);
});

it('should deny if backend call is rejected', async () => {
    superagent.__setResult(200, __defaultVerificationResponse, true);
    const result = await lambda.handler(__defaultEvent);
    expectDeny(result);
});

it('should deny if backend call throws exception', async () => {
    superagent.__setResult(200, __defaultVerificationResponse);
    superagent.__throwException("TestException");
    const result = await lambda.handler(__defaultEvent);
    expectDeny(result);
});


function expectAllows(result) {
    extractAndExpectEffect(result, "Allow");
}

function expectDeny(result) {
    extractAndExpectEffect(result, "Deny");
}

function extractAndExpectEffect(result, expectedValue) {
    const statement = result.policyDocument.Statement;
    expect(statement.length).toBe(1);
    expect(statement[0].Effect).toBe(expectedValue);
}


function getDefaultEvent() {
    return {
        "headers": {
            "x-apikey": __defaultXApiKey,
            "module-type": __defaultModuleType
        }
    }
}

function getDefaultVerificationResponse() {
    return {
        "valid": true,
        "message": null,
        "privileges": {
            "tenantPrivileges": [
                {
                    "tenantId": 1,
                    "tenantUuid": "d938gi",
                    "privileges": "admin",
                    "id": 1
                }
            ],
            "tenantModulePrivileges": [
                {
                    "tenantId": 1,
                    "tenantUuid": "d938gi",
                    "module": "ranking",
                    "privileges": "user,admin",
                    "id": 325
                },
                {
                    "tenantId": 1,
                    "tenantUuid": "d938gi",
                    "module": __defaultModuleType,
                    "privileges": "user,admin",
                    "id": 620
                }
            ]
        }
    }
}