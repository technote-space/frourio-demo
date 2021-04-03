#!/bin/bash

set -e

current=$(
  cd "$(dirname "$0")"
  pwd
)
cd "${current}/.."

docker-compose stop
