#!/bin/bash

source 00_properties.sh

sam package \
  --template-file template.yaml \
  --output-template-file template.packaged.yaml \
  --s3-bucket $BUCKET