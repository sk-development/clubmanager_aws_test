#!/bin/bash

# Copy that file to 00_properties.sh and set all predefined and generated properties

BASEFOLDER=$(pwd)
ACCOUNT_ID=<AWS Account ID>
REGION=<AWS deployment region>
PREFIX=<Prefix for all generated resources>
TIME=$(date +%s%3)

STACKNAME=<Name for the stack> # HINT: Only chars/numbers and "-" allowed


# Lambda properties
LAMBDA_EXECUTION_ROLE=arn:aws:iam::$ACCOUNT_ID:role/SK_LambdaBasicExecutionRole_test

# DynamoDB properties
TABLE_NAME_SURVEYS_GENERATED='PUT THE NAME OF THE GENERATED SURVEYS TABLE HERE'

