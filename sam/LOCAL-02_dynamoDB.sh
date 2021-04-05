#!/bin/bash
source 00_properties.sh

aws dynamodb create-table \
    --endpoint-url http://localhost:4566 \
    --table-name SurveysTable \
    --attribute-definitions AttributeName=id,AttributeType=S \
    --key-schema AttributeName=id,KeyType=HASH \
    --billing-mode PAY_PER_REQUEST

aws dynamodb put-item \
    --endpoint-url http://localhost:4566 \
    --table-name SurveysTable \
    --item '{
        "id": {"S": "4af77dd0-c70f-471d-8a26-59b38f885756"},
        "name": {"S": "Test survey"} ,
        "options": { "L": [ { "M" : { "index" : { "N" : "0" }, "text" : { "S" : "option1" } } }, { "M" : { "index" : { "N" : "1" }, "text" : { "S" : "option2" } } } ] }
      }' \
    --return-consumed-capacity TOTAL

aws dynamodb put-item \
    --endpoint-url http://localhost:4566 \
    --table-name SurveysTable \
    --item '{
        "id": {"S": "e4346a00-14ce-4a8a-b2f8-06e55e7a0d08"},
        "name": {"S": "Another survey"} ,
        "options": { "L": [ { "M" : { "index" : { "N" : "0" }, "text" : { "S" : "option1" } } }, { "M" : { "index" : { "N" : "1" }, "text" : { "S" : "option2" } } }, { "M" : { "index" : { "N" : "2" }, "text" : { "S" : "option3" } } } ] }
      }' \
    --return-consumed-capacity TOTAL

aws dynamodb list-tables --endpoint-url http://localhost:4566

# aws dynamodb scan --endpoint-url http://localhost:4566 --table-name SurveysTable 
