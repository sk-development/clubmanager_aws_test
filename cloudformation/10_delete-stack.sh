#!/bin/bash
source 00_properties.sh

aws cloudformation delete-stack --stack-name $STACKNAME
