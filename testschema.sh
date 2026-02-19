#!/usr/bin/env bash`
npm install -g @prantlf/jsonlint
jsonlint --validate schemas/x3d-4.1-JSONSchema.json --environment draft-2020-12 examples/abox.json 1> /dev/null
