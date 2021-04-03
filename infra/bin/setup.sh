#!/bin/bash

set -e

current=$(
  cd "$(dirname "$0")"
  pwd
)
cd "${current}/.."

# copy env
cp .env.example .env

# Install nvm
# https://github.com/nvm-sh/nvm#installing-and-updating
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.38.0/install.sh | bash
