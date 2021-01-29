// Load the AWS SDK for Node.js
var AWS = require('aws-sdk');
// Set the region 
AWS.config.update({region: 'eu-central-1'});
// Create DynamoDB service object
var dynamoDb = new AWS.DynamoDB({apiVersion: '2012-08-10'});

exports.handler = async (event) => {
    var params = {
        TableName: process.env.TABLE_NAME,
        Item: event
    };
 
    try {
        await dynamoDb.putItem(params).promise();
    }
    catch(err)
    {
        console.log(err);
    }

    const response = {
        statusCode: 200,
    };

    return response;
};