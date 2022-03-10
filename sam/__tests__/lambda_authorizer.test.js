const { handler } = require('../src/lambda_authorizer/index');
const { __setResult, __init } = require('../__mocks__/superagent');

beforeEach(() => {
    __init()
})

test('Invalid Authorization Api response returns deny policy', async() => {
    __setResult(200, provideSuperagentMockResponseData(false, "", "", ""));
    const response = await handler(provideEventForAuthorizerTest())
    expect(response.policyDocument.Statement[0].Effect).toBe("Deny")
})

test('Global Admin is identified as Global Admin', async() => {
    __setResult(200, provideSuperagentMockResponseData(true, "admin", "survey", "user,admin"));
    const response = await handler(provideEventForAuthorizerTest())
    expect(response.context.isGlobalAdmin).toBe(true)
})

test('Global Admin gets Global Admin module privileges', async() => {
    __setResult(200, provideSuperagentMockResponseData(true, "admin", "survey", "user,admin"));
    const response = await handler(provideEventForAuthorizerTest())
    expect(response.context.modulePrivileges).toBe('globalAdmin')
})

test('No module privileges return deny policy', async() => {
    __setResult(200, provideSuperagentMockResponseData(true, "", "", ""));
    const response = await handler(provideEventForAuthorizerTest())
    expect(response.policyDocument.Statement[0].Effect).toBe("Deny")
})

test('Invalid module privileges return deny policy', async() => {
    __setResult(200, provideSuperagentMockResponseData(true, "", "survey", ""));
    const response = await handler(provideEventForAuthorizerTest())
    expect(response.policyDocument.Statement[0].Effect).toBe("Deny")
})

test('Not a global admin and user tenant module privileges return isGlobalAdmin as false', async() => {
    __setResult(200, provideSuperagentMockResponseData(true, "", "survey", "user"));
    const response = await handler(provideEventForAuthorizerTest())
    expect(response.context.isGlobalAdmin).toBe(false)
})

test('Not a global admin and user tenant module privileges return user privileges', async() => {
    __setResult(200, provideSuperagentMockResponseData(true, "", "survey", "user"));
    const response = await handler(provideEventForAuthorizerTest())
    expect(response.context.modulePrivileges).toBe("user")
})

test('Not a global admin and admin tenant module privileges return isGlobalAdmin as false', async() => {
    __setResult(200, provideSuperagentMockResponseData(true, "", "survey", "user"));
    const response = await handler(provideEventForAuthorizerTest())
    expect(response.context.isGlobalAdmin).toBe(false)
})

test('Not a global admin and admin tenant module privileges return admin privileges', async() => {
    __setResult(200, provideSuperagentMockResponseData(true, "", "survey", "user,admin"));
    const response = await handler(provideEventForAuthorizerTest())
    expect(response.context.modulePrivileges).toContain("admin")
})

test('Error in superagent call results in deny policy return', async() => {
    __setResult(403, provideSuperagentMockResponseData(false, "", "", ""), true);
    const response = await handler(provideEventForAuthorizerTest())
    expect(response.policyDocument.Statement[0].Effect).toBe("Deny")
})

function provideEventForAuthorizerTest() {
    return {
        "headers": {
            "content-type": "application/json",
            "module-type": "survey"
        }
    }
}

function provideSuperagentMockResponseData(valid, tenantPrivileges, moduleName, tenantModulePrivileges) {
    return {
        "valid": valid,
        "message": null,
        "privileges": {
          "tenantPrivileges": [
            {
              "tenantId": 1,
              "tenantUuid": "d938gi_test2",
              "privileges": tenantPrivileges,
              "id": 1
            }
          ],
          "tenantModulePrivileges": [
            {
              "tenantId": 1,
              "tenantUuid": "d938gi_test2",
              "module": moduleName,
              "privileges": tenantModulePrivileges,
              "id": 620
            }
           ]
        }
    }
}