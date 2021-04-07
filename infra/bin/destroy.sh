#!/bin/bash

set -e

current=$(
  cd "$(dirname "$0")"
  pwd
)
cd "${current}/.."

docker-compose down
docker volume rm infra_frourio_demo_db
