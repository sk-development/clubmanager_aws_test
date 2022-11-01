#!/bin/bash
source 00_properties.sh

sam local start-api \
    --template-file template.yaml \
    --docker-network localstack_default \
    --parameter-overrides LambdaExecutionRole=$LAMBDA_EXECUTION_ROLE \
                      AuthHost=$AUTH_HOST \
                      AuthToken=$AUTH_TOKEN \
                      TenantUuid=$TENANT_UUID \
                      LocalEndpoint=$LOCAL_ENDPOINT \
    --warm-containers LAZY

    # --warm-containers EAGER

# sam local start-api -d 5858 --debug-function PutSurvey \
# sam local start-api -d 5858 --debug-function GetSurveys \
#     --template-file template.yaml \
#     --docker-network localstack_default \
#     --parameter-overrides LocalEndpoint=$LOCAL_ENDPOINT

# working script for debugging
# sam local start-api -d 5858 \
#     --template-file template.yaml \
#     --docker-network localstack_default \
#     --parameter-overrides LocalEndpoint=$LOCAL_ENDPOINT \
#     --debug \
#     --warm-containers LAZY \
#     --debug-function GetParticipations
