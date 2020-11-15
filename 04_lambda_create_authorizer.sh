#!/bin/bash
source 00_properties.sh

DEPLOYFILE=handler_lambda_authorizer.zip
SRCFOLDER=lambda_authorizer

rm $DEPLOYFILE
cd $SRCFOLDER
zip -r ../$DEPLOYFILE *
cd ..

aws lambda create-function \
    --function-name $LAMBDA_FUNCTION_AUTHORIZER \
    --runtime nodejs12.x \
    --zip-file fileb://$BASEFOLDER/$DEPLOYFILE \
    --handler index.handler \
    --role $LAMBDA_EXECUTION_ROLE 

rm $DEPLOYFILE