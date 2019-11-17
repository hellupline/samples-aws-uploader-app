import json
import typing as T


def apigateway_response(body: T.Any, status_code=200) -> T.Dict[str, T.Any]:
    return {
        "isBase64Encoded": False,
        "headers": {
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Headers": "origin, content-type, accept",
            "Access-Control-Allow-Credentials": "true",
            "Content-Type": "application/json",
        },
        "statusCode": status_code,
        "body": json.dumps(body),
    }


def apigateway_get_user_id(event) -> str:
    return event["requestContext"]["authorizer"]["claims"]["sub"]
