#!/bin/bash
# source 00_properties.sh

# this file contains all tests with the global secondary index
# to test this, comment out each aws dynamodb statement that you like to test and run the the shell script in your terminal

# create ParticipationsTable with two indexes
# aws dynamodb create-table \
#     --endpoint-url http://localhost:4566 \
#     --table-name ParticipationsTable \
#     --attribute-definitions AttributeName=id,AttributeType=S \
#                             AttributeName=surveyId,AttributeType=S \
#                             AttributeName=userId,AttributeType=S \
#     --key-schema AttributeName=id,KeyType=HASH \
#     --billing-mode PAY_PER_REQUEST \
#     --global-secondary-indexes \
#         "[
#             {
#                 \"IndexName\": \"surveyIndex\",
#                 \"KeySchema\": [{\"AttributeName\":\"surveyId\",\"KeyType\":\"HASH\"}],
#                 \"Projection\":{
#                     \"ProjectionType\":\"INCLUDE\",
#                     \"NonKeyAttributes\":[\"userId\",\"options\",\"comment\"]
#                 }
#             },
#             {
#                 \"IndexName\": \"userIndex\",
#                 \"KeySchema\": [{\"AttributeName\":\"userId\",\"KeyType\":\"HASH\"}],
#                 \"Projection\":{
#                     \"ProjectionType\":\"INCLUDE\",
#                     \"NonKeyAttributes\":[\"surveyId\",\"options\",\"comment\"]
#                 }
#             }
#         ]"

# put two demo records into ParticipationsTable
# aws dynamodb put-item \
#     --endpoint-url http://localhost:4566 \
#     --table-name ParticipationsTable \
#     --item '{
#         "id": {"S": "4af77dd0-c70f-471d-8a26-59b38f885756"},
#         "surveyId": {"S": "1"} ,
#         "userId": {"S": "1"},
#         "options": { "L": [ { "M" : { "id" : { "S" : "11476895-c699-4ff0-8457-28cd239a8090" }, "text" : { "S" : "option1" } } }, { "M" : { "id" : { "S" : "d8f7153c-5a23-4a59-8b10-6ecbaf86655d" }, "text" : { "S" : "option2" } } }, { "M" : { "id" : { "S" : "122d4dd9-7582-408b-91f1-8d5d6a4c0d72" }, "text" : { "S" : "option3" } } } ] },
#         "comment": {"S": "This is a test comment"}
#       }' \
#     --return-consumed-capacity TOTAL
# aws dynamodb put-item \
#     --endpoint-url http://localhost:4566 \
#     --table-name ParticipationsTable \
#     --item '{
#         "id": {"S": "4af55dd0-c70a-471d-8a26-59b38f881234"},
#         "surveyId": {"S": "2"} ,
#         "userId": {"S": "2"},
#         "options": { "L": [ { "M" : { "id" : { "S" : "11476895-c699-4ff0-8457-28cd239a8090" }, "text" : { "S" : "option1" } } }, { "M" : { "id" : { "S" : "d8f7153c-5a23-4a59-8b10-6ecbaf86655d" }, "text" : { "S" : "option2" } } }, { "M" : { "id" : { "S" : "122d4dd9-7582-408b-91f1-8d5d6a4c0d72" }, "text" : { "S" : "option3" } } } ] },
#         "comment": {"S": "This is a second test comment"}
#       }' \
#     --return-consumed-capacity TOTAL

# return all items inside ParticipationsTable
aws dynamodb scan --endpoint-url http://localhost:4566 --table-name ParticipationsTable

# query global secondary index: surveyIndex --> query = get record based on conditions
# aws dynamodb query \
#     --endpoint-url http://localhost:4566 \
#     --table-name ParticipationsTable \
#     --index-name surveyIndex \
#     --key-condition-expression "surveyId = :id" \
#     --expression-attribute-values  '{":id":{"S":"2"}}'

#scan table with global secondary index: surveyIndex -> scan = get all items from table but use index instead of primary key
# aws dynamodb scan \
#     --endpoint-url http://localhost:4566 \
#     --table-name ParticipationsTable \
#     --index-name surveyIndex

# delete ParticipationsTable
# aws dynamodb delete-table --table-name ParticipationsTable --endpoint-url http://localhost:4566

# list ParticipationsTable
# aws dynamodb list-tables --endpoint-url http://localhost:4566
