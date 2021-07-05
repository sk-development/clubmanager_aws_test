#!/bin/bash

source 00_properties.sh
# successfull build
sam build --template-file template.yaml

# new test
# sam build --template-file template.yaml --use-container

  # env var approaches not working
  # --container-env-var HOST=http://localhost:8090 \
  # --container-env-var XACCESSTOKEN=366EB3BD45CE5CE769F0B8BFD3472A482B07EC1F32E56ADA1625B8A7FB324B66
  # --container-env-var-file environment.json

  # --parameter-overrides LambdaExecutionRole=$LAMBDA_EXECUTION_ROLE \
  # --region $REGION