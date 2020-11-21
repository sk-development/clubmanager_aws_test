#!/bin/bash

# Copy that file to 00_properties.sh and set all predefined and generated properties

BASEFOLDER=$(pwd)
ACCOUNT_ID=<AWS Account ID>
REGION=<AWS deployment region>
PREFIX=<Prefix for all generated resources>
TIME=$(date +%s%3)

STACKNAME=<Name for the stack> # HINT: Only chars/numbers and "-" allowed

# DynamoDB properties
TABLE_NAME_SURVEYS=$PREFIX"_surveys"

# Lambda properties
LAMBDA_EXECUTION_ROLE=arn:aws:iam::$ACCOUNT_ID:role/SK_LambdaBasicExecutionRole_test
LAMBDA_FUNCTION_GET_SURVEYS=$PREFIX"_get_surveys"
LAMBDA_FUNCTION_AUTHORIZER=$PREFIX"_authorizer"

# Api gateway properties -> pre-defined
APIGATEWAY_STAGE=stage
APIGATEWAY_API_NAME=$PREFIX"_clubmanager_surveys"
APIGATEWAY_AUTHORIZER_FUNCTION=$PREFIX"_authorizer"
