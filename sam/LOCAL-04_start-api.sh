#!/bin/bash
source 00_properties.sh

sam local start-api \
    --template-file template.yaml \
    --docker-network localstack_default \
    --parameter-overrides LambdaExecutionRole=$LAMBDA_EXECUTION_ROLE \
                      AuthHost=$AUTH_HOST \
                      AuthToken=$AUTH_TOKEN \
                      LocalEndpoint=$LOCAL_ENDPOINT \
    --warm-containers LAZY

# sam local start-api -d 5858 --debug-function GetSurveys \
#     --template-file template.yaml \
#     --docker-network localstack_default \
#     --parameter-overrides LocalEndpoint=$LOCAL_ENDPOINT