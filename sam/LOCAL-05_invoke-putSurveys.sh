#!/bin/bash
source 00_properties.sh

sam local invoke "PutSurveys" -e events/putSurveys.json \
    --docker-network localstack_default \
    --parameter-overrides LocalEndpoint=$LOCAL_ENDPOINT