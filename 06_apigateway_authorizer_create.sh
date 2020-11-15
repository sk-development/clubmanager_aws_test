#!/bin/bash
source 00_properties.sh

aws apigateway create-authorizer --rest-api-id $APIGATEWAY_API_ID \
    --name $APIGATEWAY_AUTHORIZER_FUNCTION \
    --type TOKEN \
    --authorizer-uri "arn:aws:apigateway:$REGION:lambda:path/2015-03-31/functions/arn:aws:lambda:$REGION:$ACCOUNT_ID:function:$LAMBDA_FUNCTION_AUTHORIZER/invocations" \
    --identity-source 'method.request.header.Authorization' \
    --authorizer-result-ttl-in-seconds 300