#!/bin/bash
source 00_properties.sh


# TABLE_NAME=SurveysTable LOCAL_ENDPOINT=http://localhost:4566 node -e 'var mod=require("./index"); mod.handler().then((value)=>console.log(value))'

# node -e '
# var AWS = require("aws-sdk");
# AWS.config.update({ region: "eu-central-1" });
# var lambda = new AWS.Lambda({
#     apiVersion: "2015-03-31",
#     endpoint: "http://127.0.0.1:3001",
#     sslEnabled: false
# });
# var params = {
#     FunctionName: "GetSurveys",
#     InvocationType: "RequestResponse"
#     // Payload: `${event}`
# };

# const authorizerResult = lambda.invoke(params).promise();
# console.log(authorizerResult);'

