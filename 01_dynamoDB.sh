#!/bin/bash
source 00_properties.sh

aws dynamodb create-table \
    --table-name $TABLE_NAME_SURVEYS \
    --attribute-definitions AttributeName=id,AttributeType=N \
    --key-schema AttributeName=id,KeyType=HASH \
    --billing-mode PAY_PER_REQUEST