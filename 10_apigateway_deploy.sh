#!/bin/bash
source 00_properties.sh

aws apigateway create-deployment --rest-api-id $APIGATEWAY_API_ID --stage-name $APIGATEWAY_STAGE