#!/bin/bash

npm run builddocker
docker build . --tag runner