#!/bin/bash

aws dynamodb delete-table --table-name SurveysTable --endpoint-url http://localhost:4566
aws dynamodb delete-table --table-name ParticipationsTable --endpoint-url http://localhost:4566
aws dynamodb list-tables --endpoint-url http://localhost:4566
