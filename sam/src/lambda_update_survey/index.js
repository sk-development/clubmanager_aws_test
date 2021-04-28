// const AWS = require('aws-sdk');
// AWS.config.update({
//     region: "eu-central-1"
// });
// Create DynamoDB service object
// var endPoint = (process.env.LOCAL_ENDPOINT == "AWS::NoValue") ? null : process.env.LOCAL_ENDPOINT;
// var dynamoDb = new AWS.DynamoDB({ apiVersion: '2012-08-10', endpoint: endPoint });
// const { marshall } = require('@aws-sdk/util-dynamodb');

// exports.handler = async (event) => {
    //OLD VERSION
    //var id = parseInt(JSON.parse(event.body).id);
    // var id = JSON.parse(event.body).id;
    // var name = JSON.parse(event.body).name;
    // var params = {
    //     'ExpressionAttributeNames': {
    //         '#NA': 'name',
    //     },
    //     'ExpressionAttributeValues': {
    //         ':na': {
    //             'S': `${name}`
    //         }
    //     },
    //     'TableName': `${process.env.TABLE_NAME}`,
    //     'Key': {
    //         'id':
    //         {
    //             'S': `${id}`
    //         }
    //     },
    //     'ReturnValues': "ALL_NEW",
    //     'UpdateExpression': "SET #NA = :na"
    // };
    // var result;
    // try {
    //     result = await dynamoDb.updateItem(params).promise();
    // } catch (err) {
    //     result = err;
    // }
    //
    //NEW VERSION
    // const data = JSON.parse(event.body)
    // const params = {
    //     TableName: `${process.env.TABLE_NAME}`,
    //     Key: marshall({
    //         id: `${data.id}`
    //     }),
        // UpdateExpression: "set name=:n, validTo=:v, description=:d, options=:o", //comment this in to update all fields
//         UpdateExpression: "set title = :t",
//         ExpressionAttributeValues: marshall({
//             ":t": `${data.title}`,
//             // ":v": JSON.parse(event.body).validTo,
//             // ":d": JSON.parse(event.body).description,
//             // ":o": JSON.parse(event.body).options
//         }),
//     }
//     var result;
//     try {
//         const { item } = await dynamoDb.updateItem(params).promise();
//         result = 'Success'
//     } catch (err) {
//         result = err;
//     }
//     const response = {
//         statusCode: 200,
//         headers: {
//             "Access-Control-Allow-Origin": "http://localhost:4200",
//         },
//         body: JSON.stringify(result)
//     };
//     return response;
// };

var cloudIntegration = require(process.env.AWS ? '/opt/aws-integration/index' : '../layers/aws-integration/index');

exports.handler = async (event) => {
    return await cloudIntegration.LAMBDA_PROXY_ADAPTER.handleAsync(businessLogic, event);
};

async function businessLogic(event) {
    var data = await cloudIntegration.SURVEY_REPOSITORY.updateSurvey(event);
    return {
        executionSuccessful: true,
        data
    }
}