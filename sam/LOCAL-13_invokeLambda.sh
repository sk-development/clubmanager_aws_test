#!/bin/bash

# aws lambda invoke --function-name "LambdaAuthorizer" --endpoint-url "http://127.0.0.1:3001" --no-verify-ssl outNew.txt

node -e '
var AWS = require("aws-sdk");
AWS.config.update({ region: "eu-central-1" });
var lambda = new AWS.Lambda({
    apiVersion: "2015-03-31",
    endpoint: "http://127.0.0.1:3001",
    sslEnabled: false,
    logger: console
});
var params = {
    FunctionName: "LambdaAuthorizer",
    InvocationType: "RequestResponse"
    // Payload: `${event}`
};

const authorizerResult = lambda.invoke(params).promise();
console.log(authorizerResult);'
