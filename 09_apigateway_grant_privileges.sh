#!/bin/bash
source 00_properties.sh

aws lambda add-permission --function-name $LAMBDA_FUNCTION_AUTHORIZER \
    --statement-id $PREFIX"_AUTHORIZER_PRIVILEGE_"$TIME \
    --action lambda:InvokeFunction \
    --principal apigateway.amazonaws.com \
    --source-arn "arn:aws:execute-api:$REGION:$ACCOUNT_ID:$APIGATEWAY_API_ID/*"

aws lambda add-permission --function-name $LAMBDA_FUNCTION_GET_SURVEYS \
    --statement-id $PREFIX"_GET_SURVEYS_PRIVILEGE_"$TIME \
    --action lambda:InvokeFunction \
    --principal apigateway.amazonaws.com \
    --source-arn "arn:aws:execute-api:$REGION:$ACCOUNT_ID:$APIGATEWAY_API_ID/*/GET/*"