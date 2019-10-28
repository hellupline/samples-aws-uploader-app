#!/usr/bin/env -S jq -Mf

{
    "Amplify": {
        "Auth": {
            # "region": ($ENV.AWS_REGION // "us-east-1"),
            "region": "us-east-1",
            "identityPoolId": .IdentityPoolId,
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
    }
}
