#!/bin/bash
source 00_properties.sh

aws apigateway create-resource --rest-api-id $APIGATEWAY_API_ID --parent-id $APIGATEWAY_API_BASE_URL_ID \
    --path-part "surveys"
# Returns API_RESOURCE_ID_SURVEYS -> properties.$APIGATEWAY_API_RESOURCE_ID_SURVEYS

