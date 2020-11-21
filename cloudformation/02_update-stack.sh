#!/bin/bash
source 00_properties.sh

aws cloudformation update-stack --stack-name $STACKNAME \
    --template-body file:///$BASEFOLDER/template.yaml 