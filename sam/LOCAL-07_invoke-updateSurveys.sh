#!/bin/bash
source 00_properties.sh

sam local invoke "UpdateSurveys" -e events/updateSurveys.json \
    --docker-network localstack_default \
    --parameter-overrides LocalEndpoint=$LOCAL_ENDPOINT