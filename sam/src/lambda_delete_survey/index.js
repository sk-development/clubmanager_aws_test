const AWS = require('aws-sdk');
AWS.config.update({
    region: "eu-central-1"
});
// Create DynamoDB service object
var endPoint = (process.env.LOCAL_ENDPOINT == "AWS::NoValue") ? null : process.env.LOCAL_ENDPOINT;
var dynamoDb = new AWS.DynamoDB({ apiVersion: '2012-08-10', endpoint: endPoint });

exports.handler = async (event) => {
    try {
        var params = {
            'TableName': `${process.env.TABLE_NAME}`,
            'Key': {
                'id':
                {
                    'S': event.queryStringParameters.surveyID
                }
            }
        };
        var result;
        result = await dynamoDb.deleteItem(params).promise();
        response = {
            statusCode: 200,
            headers: {
                "Access-Control-Allow-Origin": "http://localhost:4200",
                // "Access-Control-Allow-Methods": "'OPTIONS,POST,GET'",
                // "Access-Control-Allow-Headers": "'Content-Type, x-apikey, x-tenantid'"
            },
            body: JSON.stringify(result)
        };
        
    } catch (err) {
        result = err;
        response = {
            statusCode: 500,
            headers: {
                "Access-Control-Allow-Origin": "http://localhost:4200",
                // "Access-Control-Allow-Methods": "'OPTIONS,POST,GET'",
                // "Access-Control-Allow-Headers": "'Content-Type, x-apikey, x-tenantid'"
            },
            body: JSON.stringify(result)
        };
    }
    return response;
};