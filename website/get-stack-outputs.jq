#!/usr/bin/env -S jq -Mf

.Stacks[].Outputs | map({"key": .OutputKey, "value": .OutputValue}) | from_entries
