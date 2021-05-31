#!/bin/bash
source 00_properties.sh

aws dynamodb create-table \
    --endpoint-url http://localhost:4566 \
    --table-name ParticipationsTable \
    --attribute-definitions AttributeName=participationId,AttributeType=S \
                            AttributeName=userId,AttributeType=S \
                            AttributeName=surveyId,AttributeType=S  \
    --key-schema AttributeName=participationId,KeyType=HASH \
    --global-secondary-indexes \
        "[
                        {
                \"IndexName\": \"SurveyIndexAll\",
                \"KeySchema\": [{\"AttributeName\":\"surveyId\",\"KeyType\":\"HASH\"},
                                {\"AttributeName\":\"userId\",\"KeyType\":\"RANGE\"}],
                \"Projection\":{
                    \"ProjectionType\":\"ALL\"
                }
            },
            {
                \"IndexName\": \"UserIndex\",
                \"KeySchema\": [{\"AttributeName\":\"userId\",\"KeyType\":\"HASH\"}],
                \"Projection\":{
                    \"ProjectionType\":\"INCLUDE\",
                    \"NonKeyAttributes\":[\"surveyId\"]
                }
            }
        ]" \
    --billing-mode PAY_PER_REQUEST

# aws dynamodb put-item \
#     --endpoint-url http://localhost:4566 \
#     --table-name ParticipationsTable \
#     --item '{
#         "participationId": {"S": "a673374a-5af2-4a85-b382-b56f402ef192"},
#         "userId": {"S": "baffa4db-f0c0-4beb-97ee-f0622f65374d"},
#         "surveyId": {"S": "e4346a00-14ce-4a8a-b2f8-06e55e7a0d08"},
#         "notation": {"S": "Test notation"},
#         "editedOptionsIds": { "L": [ { "M" : { "id" : { "S" : "d8f7153c-5a23-4a59-8b10-6ecbaf86655d" } } }, { "M" : { "id" : { "S" : "122d4dd9-7582-408b-91f1-8d5d6a4c0d72" }} } ] }
#       }' \
#     --return-consumed-capacity TOTAL

# aws dynamodb put-item \
#     --endpoint-url http://localhost:4566 \
#     --table-name ParticipationsTable \
#     --item '{
#         "participationId": {"S": "52e57bae-06e9-4c38-8e37-6c332bd2ae85"},
#         "userId": {"S": "b70b9f03-4478-40f2-9acd-3399c32f6fed"},
#         "surveyId": {"S": "e4346a00-14ce-4a8a-b2f8-06e55e7a0d08"},
#         "notation": {"S": "Another notation"},
#         "editedOptionsIds": { "L": [ { "M" : { "id" : { "S" : "11476895-c699-4ff0-8457-28cd239a8090" } } }, { "M" : { "id" : { "S" : "d8f7153c-5a23-4a59-8b10-6ecbaf86655d" } } } ] }
#       }' \
#     --return-consumed-capacity TOTAL

# aws dynamodb list-tables --endpoint-url http://localhost:4566

# aws dynamodb scan --endpoint-url http://localhost:4566 --table-name ParticipationsTable