#!/bin/bash

aws dynamodb delete-table --table-name SurveysTable --endpoint-url http://localhost:4566
