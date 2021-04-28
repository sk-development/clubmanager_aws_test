#!/bin/bash
source 00_properties.sh

# use this call for debuggig purposes
# sam local invoke "UpdateSurveys" -d 5858 -e events/updateSurveys.json \
#     --docker-network localstack_default \
#     --parameter-overrides LocalEndpoint=$LOCAL_ENDPOINT

sam local invoke "UpdateSurveys" -e events/updateSurveys.json \
    --docker-network localstack_default \
    --parameter-overrides LocalEndpoint=$LOCAL_ENDPOINT