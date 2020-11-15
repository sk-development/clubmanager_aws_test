#!/bin/bash
source 00_properties.sh

DEPLOYFILE=handler_lambda_get_surveys.zip
SRCFOLDER=lambda_get_surveys

rm $DEPLOYFILE
cd $SRCFOLDER
zip -r ../$DEPLOYFILE *
cd ..

aws lambda create-function \
    --function-name $LAMBDA_FUNCTION_GET_SURVEYS \
    --runtime nodejs12.x \
    --zip-file fileb://$BASEFOLDER/$DEPLOYFILE \
    --handler index.handler \
    --role $LAMBDA_EXECUTION_ROLE \
    --environment "Variables={TABLE_NAME=$TABLE_NAME_SURVEYS}"

rm $DEPLOYFILE