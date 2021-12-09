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
        "title": {"S": "Test survey"} ,
        "description": {"S": "Test description"},
        "validTo": {"S": "30.02.2022"},
        "options": { "L": [ { "M" : { "id" : { "S" : "3b00b98c-0216-4947-a9c6-8a50ce842c0b" }, "text" : { "S" : "option1" } } }, { "M" : { "id" : { "S" : "9f1f8946-e9d7-4416-9f6a-dd4146de8fb2" }, "text" : { "S" : "option2" } } } ] },
        "sections": { "L": [ { "M" : {
          "id" : { "S" : "11476895-c699-4ff0-8457-28cd239a1234" }, 
          "text" : { "S" : "section1" }, 
          "multiSelect" : { "BOOL" : false },
          "options": { "L": [ { "M" : {
            "id": { "S": "11476895-c699-4ff0-8457-28cd239a4567"},
            "text": { "S": "option1" }
          }}]}
          }}]}
      }' \
    --return-consumed-capacity TOTAL

aws dynamodb put-item \
    --endpoint-url http://localhost:4566 \
    --table-name SurveysTable \
    --item '{
        "id": {"S": "e4346a00-14ce-4a8a-b2f8-06e55e7a0d08"},
        "title": {"S": "Another survey"} ,
        "description": {"S": "Another description"},
        "validTo": {"S": "30.02.2022"},

        "options": { "L": [ { "M" : {
          "id" : { "S" : "11476895-c699-4ff0-8457-28cd239a8090" },
          "text" : { "S" : "option1" }
          } },
          { "M" : { "id" : { "S" : "d8f7153c-5a23-4a59-8b10-6ecbaf86655d" }, "text" : { "S" : "option2" } } }, { "M" : { "id" : { "S" : "122d4dd9-7582-408b-91f1-8d5d6a4c0d72" }, "text" : { "S" : "option3" } } } ] },

        "sections": { "L": [ { "M" : {
          "id" : { "S" : "11476895-c699-4ff0-8457-28cd239a1234" }, 
          "text" : { "S" : "section1" }, 
          "multiSelect" : { "BOOL" : false },
          "options": { "L": [ { "M" : {
            "id": { "S": "11476895-c699-4ff0-8457-28cd239a4567"},
            "text": { "S": "option1" }
          }}]}
          }},
          { "M" : {
          "id" : { "S" : "11476895-c699-4ff0-8457-28cd239a7584" }, 
          "text" : { "S" : "section2" }, 
          "multiSelect" : { "BOOL" : false },
          "options": { "L": [ { "M" : {
            "id": { "S": "11476895-c699-4ff0-8457-28cd239a4879"},
            "text": { "S": "option2" }
          }}]}
          }}
          ]}
      }' \
    --return-consumed-capacity TOTAL

aws dynamodb list-tables --endpoint-url http://localhost:4566

# aws dynamodb scan --endpoint-url http://localhost:4566 --table-name SurveysTable 
