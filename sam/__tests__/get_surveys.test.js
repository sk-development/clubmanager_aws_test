const { handler } = require('../src/lambda_get_surveys/index');
const aws = require('aws-sdk');
const { __setResult } = require('../__mocks__/superagent');

const mockedSuperagentAdminResponseData = {
    "valid": true,
    "message": null,
    "privileges": {
      "tenantPrivileges": [
        {
          "tenantId": 1,
          "tenantUuid": "d938gi_test2",
          "privileges": "admin",
          "id": 1
        }
      ],
      "tenantModulePrivileges": [
        {
          "tenantId": 1,
          "tenantUuid": "d938gi_test2",
          "module": "members",
          "privileges": "privileges,create,delete,batchDelete,read,write,readRelations,writeRelations,calculateFees,calculateBirthdays,relation-read:sections,relation-write:sections,relation-read:relations,relation-write:relations,relation-read:certificates,relation-write:certificates,relation-read:debit_authorizations,relation-write:debit_authorizations,relation-read:billing-types,relation-write:billing-types,billing-read,billing-write,section-access:0,section-access:1,section-access:2,section-access:3,section-access:4,section-access:5,section-access:6,section-access:7,section-access:8,data-read:members_members_membernumber,data-write:members_members_membernumber,data-read:members_members_salutation,data-write:members_members_salutation,data-read:members_members_lastname,data-write:members_members_lastname,data-read:members_members_firstname,data-write:members_members_firstname,data-read:members_members_title,data-write:members_members_title,data-read:members_members_gender,data-write:members_members_gender,data-read:members_members_dateofbirth,data-write:members_members_dateofbirth,data-read:members_members_street,data-write:members_members_street,data-read:members_members_zip,data-write:members_members_zip,data-read:members_members_city,data-write:members_members_city,data-read:members_members_email,data-write:members_members_email,data-read:members_members_phoneprivate,data-write:members_members_phoneprivate,data-read:members_members_phonebusiness,data-write:members_members_phonebusiness,data-read:members_members_phonemobile,data-write:members_members_phonemobile,data-read:members_members_comment,data-write:members_members_comment",
          "id": 1
        },
        {
          "tenantId": 1,
          "tenantUuid": "d938gi_test2",
          "module": "booking",
          "privileges": "read,match,series,multiResources,custom:teammatch,custom:training,custom:tournament,custom:block",
          "id": 2
        },
        {
          "tenantId": 1,
          "tenantUuid": "d938gi_test2",
          "module": "reporting",
          "privileges": "booking.listingPerMember,booking.guest",
          "id": 308
        },
        {
          "tenantId": 1,
          "tenantUuid": "d938gi_test2",
          "module": "ranking",
          "privileges": "user,admin",
          "id": 325
        },
        {
          "tenantId": 1,
          "tenantUuid": "d938gi_test2",
          "module": "survey",
          "privileges": "user,admin",
          "id": 620
        }
       ]
    }
}

__setResult(200, mockedSuperagentAdminResponseData);

test('my test', async () => {
    const myEvent = {
        "httpMethod": "SCAN",
        "headers": {
            "content-type": "application/json"
        },
        "body": "{\"name\":\"myThirdSurvey\", \"options\":[{\"index\":\"8\",\"text\":\"option8\"},{\"index\":\"9\",\"text\":\"option9\"}]}"
    };
    const response = await handler(myEvent)
    expect(response.statusCode).toBe(403)
})
  

// jest.mock('aws-sdk', () => {
//   const mDocumentClient = { scan: jest.fn() };
//   const mDynamoDB = { DocumentClient: jest.fn(() => mDocumentClient) };
//   return { DynamoDB: mDynamoDB };
// });
// const mDynamoDb = new aws.DynamoDB.DocumentClient();

// test('should get user', async () => {
//     const mResult = { name: "test" }
//     // const mResult = { 
//     //     body: "No priviliges for requested action!",
//     //     headers: {
//     //         "Access-Control-Allow-Origin": "http://localhost:4200"
//     //     },
//     //     statusCode: 403
//     // };
//     mDynamoDb.scan.mockImplementationOnce((_, callback) => callback(null, mResult));
//     const myEvent = {
//         "httpMethod": "SCAN",
//         "headers": {
//             "content-type": "application/json"
//         },
//         "body": "{\"name\":\"myThirdSurvey\", \"options\":[{\"index\":\"8\",\"text\":\"option8\"},{\"index\":\"9\",\"text\":\"option9\"}]}"
//     };
//     const actual = await handler(myEvent);
//     expect(mDynamoDb.scan).toBeCalledWith(
//         {
//             TableName: 'SurveysTable'
//         }
//     )

//     expect(actual).toEqual({ name: "test" });
//     // expect(actual).toEqual({ 
//     //     body: "\"No priviliges for requested action neu!\"",
//     //     headers: {
//     //         "Access-Control-Allow-Origin": "http://localhost:4200"
//     //     },
//     //     statusCode: 403
//     // });
//   });

// test('status code is 200', async () => {
//     const myEvent = {
//         "httpMethod": "POST",
//         "headers": {
//             "content-type": "application/json"
//         },
//         "body": "{\"name\":\"myThirdSurvey\", \"options\":[{\"index\":\"8\",\"text\":\"option8\"},{\"index\":\"9\",\"text\":\"option9\"}]}"
//     };
//     const response = await handler(myEvent);
//     expect(response.statusCode).toBe(403);
// });

// test('whole response object is valid', async () => {
//     const myResponse = { statusCode: 200, body: { message: `Hello, the current time is now.` }};
//     const myEvent = { id: 1 };
//     const response = await handler(myEvent);
//     expect(response).toEqual(myResponse);
// });