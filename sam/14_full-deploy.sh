#!/bin/bash

source 00_properties.sh

./11_build-sam.sh
./12_package-sam.sh
./13_deploy-sam.sh