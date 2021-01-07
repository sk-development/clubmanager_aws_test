#!/bin/bash
aws configure set aws_access_key_id dummy1 --profile localstack
aws configure set aws_secret_access_key dummy1 --profile localstack
aws configure set region eu-central-1 --profile localstack
aws configure set output json --profile localstack

mkdir /tmp/localstack
mkdir /tmp/localstack/data