#!/bin/bash
source 00_properties.sh

aws cloudformation describe-stack-events --stack-name $STACKNAME
