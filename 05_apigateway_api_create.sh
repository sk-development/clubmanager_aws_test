#!/bin/bash
source 00_properties.sh

aws apigateway create-rest-api --name $APIGATEWAY_API_NAME \
    --endpoint-configuration '{ "types": ["REGIONAL"] }'
# Returns API_ID -> properties.$APIGATEWAY_API_ID 
