#!/bin/bash

source 00_properties.sh

# sam package \
#   --template-file template.yaml \
#   --output-template-file template.packaged.yaml \
#   --s3-bucket $BUCKET


sam deploy \
  --template template.packaged.yaml \
  --stack-name $STACKNAME \
  --capabilities CAPABILITY_IAM \
  --parameter-overrides LambdaExecutionRole=$LAMBDA_EXECUTION_ROLE \
  --s3-bucket $BUCKET \
  --region eu-central-1