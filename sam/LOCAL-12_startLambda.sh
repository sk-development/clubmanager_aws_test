#!/bin/bash
source 00_properties.sh

sam local start-lambda \
--docker-network localstack_default \
--parameter-overrides LocalEndpoint=$LOCAL_ENDPOINT