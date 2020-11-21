#!/bin/bash
source 00_properties.sh

aws cloudformation package \
         --template-file template.yml \
         --output-template-file template.packaged.yml \
         --s3-bucket cf-templates-1cyvm6msnefyy-eu-central-1

aws cloudformation deploy \
         --template-file template.packaged.yml \
         --stack-name $STACKNAME \
         --parameter-overrides TableNameSurveys=$TABLE_NAME_SURVEYS \
                    LambdaExecutionRole=$LAMBDA_EXECUTION_ROLE \
                    LambdaFunctionNameGetSurveys=$LAMBDA_FUNCTION_GET_SURVEYS \
                    LambdaFunctionNameAuthorizer=$LAMBDA_FUNCTION_AUTHORIZER \
                    ApiGatewayName=$APIGATEWAY_API_NAME \
                    ApiGatewayAuthorizerFunction=$APIGATEWAY_AUTHORIZER_FUNCTION