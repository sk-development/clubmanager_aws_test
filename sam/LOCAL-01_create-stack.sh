#!/bin/bash
source 00_properties.sh

## IMPORTANT: not yet functional as the package command does not respect the endpoint-url and uploads to real AWS

# aws cloudformation package \
#         --endpoint-url http://localhost:4566 \
#         --template-file template.yaml \
#         --output-template-file template.packaged.yaml \
#         --s3-bucket cf-templates-1cyvm6msnefyy-eu-central-1

# aws cloudformation deploy \
#         --endpoint-url http://localhost:4566 \
#         --capabilities CAPABILITY_IAM \
#         --template-file template.packaged.yaml \
#         --stack-name $STACKNAME \
#         --parameter-overrides LambdaExecutionRole=$LAMBDA_EXECUTION_ROLE