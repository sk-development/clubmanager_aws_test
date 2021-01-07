// Load the AWS SDK for Node.js
var AWS = require('aws-sdk');
// Set the region
AWS.config.update({region: 'eu-central-1'});
// Create DynamoDB service object
var endPoint = (process.env.LOCAL_ENDPOINT=="AWS::NoValue") ? null : process.env.LOCAL_ENDPOINT;
var dynamoDb = new AWS.DynamoDB({apiVersion: '2012-08-10',endpoint: endPoint});

exports.handler = async (event) => {
    const retData = [];
    var params = {
        TableName: process.env.TABLE_NAME,
    };

    const data = await dynamoDb.scan(params).promise();

    for (var i = 0; i < data.Items.length; i++) {
        var item = data.Items[i]
        retData.push({
            id: item.id.N,
            name: item.name.S
        })
    }

    const response = {
        statusCode: 200,
        body: JSON.stringify(retData),
    };

    return response;
};