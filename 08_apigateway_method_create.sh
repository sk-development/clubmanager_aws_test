#!/bin/bash
source 00_properties.sh

aws apigateway put-method --rest-api-id $APIGATEWAY_API_ID --resource-id $APIGATEWAY_API_RESOURCE_ID_SURVEYS \
    --http-method GET --authorization-type "CUSTOM" --authorizer-id $APIGATEWAY_AUTHORIZER_ID

aws apigateway put-integration --rest-api-id $APIGATEWAY_API_ID --resource-id $APIGATEWAY_API_RESOURCE_ID_SURVEYS \
    --type AWS \
    --http-method GET \
    --integration-http-method POST \
    --uri "arn:aws:apigateway:$REGION:lambda:path/2015-03-31/functions/arn:aws:lambda:$REGION:$ACCOUNT_ID:function:$LAMBDA_FUNCTION_GET_SURVEYS/invocations"

aws apigateway put-method-response --rest-api-id $APIGATEWAY_API_ID --resource-id $APIGATEWAY_API_RESOURCE_ID_SURVEYS \
    --http-method GET \
    --status-code 200 \
    --response-models "{}"

aws apigateway put-integration-response --rest-api-id $APIGATEWAY_API_ID --resource-id $APIGATEWAY_API_RESOURCE_ID_SURVEYS \
    --http-method GET \
    --status-code 200 \
    --selection-pattern ".*"

# With this call the current settings for a method can be requested
# aws apigateway get-method --rest-api-id $APIGATEWAY_API_ID --resource-id $APIGATEWAY_API_RESOURCE_ID_SURVEYS --http-method GET
