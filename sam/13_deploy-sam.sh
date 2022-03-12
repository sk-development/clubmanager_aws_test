#!/bin/bash

source 00_properties.sh

sam deploy \
  --template template.packaged.yaml \
  --stack-name $STACKNAME \
  --capabilities CAPABILITY_IAM \
  --parameter-overrides LambdaExecutionRole=$LAMBDA_EXECUTION_ROLE \
                        AuthHost=$AUTH_HOST \
                        AuthToken=$AUTH_TOKEN \
                        TenantUuid=$TENANT_UUID \
  --s3-bucket $BUCKET \
  --region eu-central-1