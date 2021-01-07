#!/bin/bash


TABLE_NAME=SurveysTable LOCAL_ENDPOINT=http://localhost:4566 node -e 'var mod=require("./index"); mod.handler().then((value)=>console.log(value))'
