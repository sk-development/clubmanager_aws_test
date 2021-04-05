#!/bin/bash
source 00_properties.sh

sam local start-api \
    --template-file template.yaml \
    --docker-network localstack_default \
    --parameter-overrides LocalEndpoint=$LOCAL_ENDPOINT