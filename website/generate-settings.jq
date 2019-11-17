#!/usr/bin/env -S jq -Mf

{
    "Amplify": {
        "Auth": {
            # "region": ($ENV.AWS_REGION // "us-east-1"),
            "region": "us-east-1",
            "userPoolId": .UserPoolId,
            "userPoolWebClientId": .UserPoolClientId
        },
        "API": {
            "endpoints": [
                {
                    "name": "uploader",
                    "endpoint": .EndpointDomainName
                }
            ]
        }
    },
    "DynamoDB": { "UploadTable": .UploadTable, "region": "us-east-1" },
    "S3": { "UploadBucket": .UploadTable, "region": "us-east-1" }
}
