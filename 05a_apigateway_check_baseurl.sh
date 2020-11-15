#!/bin/bash
source 00_properties.sh

aws apigateway get-resources --rest-api-id $APIGATEWAY_API_ID 
# Returns API_BASE_URL_ID -> to be used for later parent references -> properties.$APIGATEWAY_API_BASE_URL_ID