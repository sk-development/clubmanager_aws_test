#!/bin/bash
source 00_properties.sh

aws cloudformation package \
         --template-file template.yaml \
         --output-template-file template.packaged.yaml \
         --s3-bucket cf-templates-1cyvm6msnefyy-eu-central-1

aws cloudformation deploy \
        --capabilities CAPABILITY_IAM \
         --template-file template.packaged.yaml \
         --stack-name $STACKNAME \
         --parameter-overrides LambdaExecutionRole=$LAMBDA_EXECUTION_ROLE