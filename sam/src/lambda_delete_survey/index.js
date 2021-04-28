// const AWS = require('aws-sdk');
// AWS.config.update({
//     region: "eu-central-1"
// });
// // Create DynamoDB service object
// var endPoint = (process.env.LOCAL_ENDPOINT == "AWS::NoValue") ? null : process.env.LOCAL_ENDPOINT;
// var dynamoDb = new AWS.DynamoDB({ apiVersion: '2012-08-10', endpoint: endPoint });

// exports.handler = async (event) => {
//     // var id = parseInt(JSON.parse(event.body).id);
//     var id = JSON.parse(event.body).id
//     var params = {
//         'TableName': `${process.env.TABLE_NAME}`,
//         'Key': {
//             'id':
//             {
//                 'S': `${id}`
//             }
//         }
//     };
//     var result;
//     try {
//         result = await dynamoDb.deleteItem(params).promise();
//     } catch (err) {
//         result = err;
//     }
//     const response = {
//         statusCode: 200,
//         body: JSON.stringify(result)
//     };
//     return response;
// };

cloudIntegration = require(process.env.AWS ? '/opt/aws-integration/index' : '../layers/aws-integration/index');

exports.handler = async (event) => {
    return await cloudIntegration.LAMBDA_PROXY_ADAPTER.handleAsync(businessLogic, event);
};

async function businessLogic(event) {
    var data = await cloudIntegration.SURVEY_REPOSITORY.deleteSurvey(event);
    return {
        executionSuccessful: true,
        data
    }
}
