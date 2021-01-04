#!/bin/bash
source 00_properties.sh

aws cloudformation package \
         --template-file sam-template.yaml \
         --output-template-file sam-template.packaged.yaml \
         --s3-bucket cf-templates-1cyvm6msnefyy-eu-central-1

aws cloudformation deploy \
        --capabilities CAPABILITY_IAM \
         --template-file sam-template.packaged.yaml \
         --stack-name $STACKNAME \
         --parameter-overrides LambdaExecutionRole=$LAMBDA_EXECUTION_ROLE