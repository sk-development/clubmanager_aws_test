#!/bin/bash
source 00_properties.sh

# for debugging
# sam local invoke "DeleteSurveys" -d 5858 -e events/deleteSurveys.json \
#     --docker-network localstack_default \
#     --parameter-overrides LocalEndpoint=$LOCAL_ENDPOINT

sam local invoke "DeleteSurveys" -e events/deleteSurveys.json \
    --docker-network localstack_default \
    --parameter-overrides LocalEndpoint=$LOCAL_ENDPOINT