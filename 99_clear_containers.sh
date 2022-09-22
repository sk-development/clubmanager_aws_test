#!/bin/bash

# stop all running containers
docker kill $(docker ps -q)

# remove all temporary images named '<none>'
docker rmi $(docker images | grep '<none>')
