#!/bin/bash

set -eu

# TOKEN=$(curl -s -X POST -H 'Accept: application/json' -H 'Content-Type: application/json' --data '{"username":"{letmein}","password":"{123}"}' https://{localhost:3015}/api/login | jq -r 'token')
# curl -s -X POST -H 'Accept: application/json' -H 'Content-Type: application/json' --data '{"username":"{letmein}","password":"{123}"}' https://{localhost:3015}/api/login
TOKEN="$( curl -s --header "Content-Type: application/json"   --request POST   --data '{"username":"letmein","password":"123"}'   http://localhost:3015/api/login | jq -r '.token')"
echo $TOKEN

curl -H 'Content-Type: application/json' -H "Authorization: Bearer ${TOKEN}" --request POST \
    --data '{"title":"raghad is super lazy and i know it"}' http://localhost:3015/api/blogs

# curl -H "Authorization: Bearer ${TOKEN}" --request DELETE http://localhost:3015/api/blogs/608401dae7ad943bd281d844

