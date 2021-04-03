#!/bin/bash

set -e

current=$(
  cd "$(dirname "$0")"
  pwd
)
cd "${current}/.."

docker-compose down
docker volume rm develop_db-store
