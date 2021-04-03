#!/bin/bash
source 00_properties.sh

sam local invoke "DeleteSurveys" -e events/deleteSurveys.json \
    --docker-network localstack_default \
    --parameter-overrides LocalEndpoint=$LOCAL_ENDPOINT