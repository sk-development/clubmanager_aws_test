const AWS = require('aws-sdk');
AWS.config.update({
    region: "eu-central-1"
});
// Create DynamoDB service object
var endPoint = (process.env.LOCAL_ENDPOINT == "AWS::NoValue") ? null : process.env.LOCAL_ENDPOINT;
var dynamoDb = new AWS.DynamoDB({ apiVersion: '2012-08-10', endpoint: endPoint });

exports.handler = async (event) => {
    //var id = parseInt(JSON.parse(event.body).id);
    var id = JSON.parse(event.body).id;
    var name = JSON.parse(event.body).title;
    var params = {
        'ExpressionAttributeNames': {
            '#NA': 'name',
        },
        'ExpressionAttributeValues': {
            ':na': {
                'S': `${name}`
            }
        },
        'TableName': `${process.env.TABLE_NAME}`,
        'Key': {
            'id':
            {
                'S': `${id}`
            }
        },
        'ReturnValues': "ALL_NEW",
        'UpdateExpression': "SET #NA = :na"
    };
    var result;
    try {
        result = await dynamoDb.updateItem(params).promise();
    } catch (err) {
        result = err;
    }
    const response = {
        statusCode: 200,
        headers: {
            "Access-Control-Allow-Origin": "http://localhost:4200",
            // "Access-Control-Allow-Methods": "'OPTIONS,POST,GET'",
            // "Access-Control-Allow-Headers": "'Content-Type, x-apikey, x-tenantid'"
        },
        body: JSON.stringify(result)
    };
    return response;
};