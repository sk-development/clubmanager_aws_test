#!/bin/bash
source 00_properties.sh

sam local invoke "PutSurvey" -e events/putSurvey.json \
    --docker-network localstack_default \
    --parameter-overrides LocalEndpoint=$LOCAL_ENDPOINT