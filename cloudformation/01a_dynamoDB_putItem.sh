#!/bin/bash
source 00_properties.sh

aws dynamodb put-item \
    --table-name $TABLE_NAME_SURVEYS \
    --item '{
        "id": {"N": "0"},
        "name": {"S": "Test survey"} ,
        "options": { "L": [ { "M" : { "index" : { "N" : "0" }, "text" : { "S" : "option1" } } }, { "M" : { "index" : { "N" : "1" }, "text" : { "S" : "option2" } } } ] }
      }' \
    --return-consumed-capacity TOTAL

aws dynamodb put-item \
    --table-name $TABLE_NAME_SURVEYS \
    --item '{
        "id": {"N": "1"},
        "name": {"S": "Another survey"} ,
        "options": { "L": [ { "M" : { "index" : { "N" : "0" }, "text" : { "S" : "option1" } } }, { "M" : { "index" : { "N" : "1" }, "text" : { "S" : "option2" } } }, { "M" : { "index" : { "N" : "2" }, "text" : { "S" : "option3" } } } ] }
      }' \
    --return-consumed-capacity TOTAL