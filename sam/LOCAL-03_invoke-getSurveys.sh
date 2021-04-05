#!/bin/bash
source 00_properties.sh

sam local invoke "GetSurveys" -e events/getSurveys.json \
    --template-file template.yaml \
    --docker-network localstack_default \
    --parameter-overrides LocalEndpoint=$LOCAL_ENDPOINT