#!/bin/bash
SCRIPT_DIR=$(realpath "$(dirname "$0")")

OUT_PATH="${SCRIPT_DIR}/../test_data/breaches_dataset.json"
BREACHES_URL=https://haveibeenpwned.com/api/v3/breaches
BREACHES_URL="file://${SCRIPT_DIR}/../test_data/breaches.json"

curl -o - "${BREACHES_URL}" | \
    jq 'sort_by(.BreachDate)' | \
    jq 'reverse' | \
    jq '.[0:60]' | \
    jq 'map({Name, BreachDate})' > "${OUT_PATH}"