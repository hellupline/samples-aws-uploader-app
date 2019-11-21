import decimal
import json
import typing as T


class DecimalEncoder(json.JSONEncoder):
    def default(self, o):
        if isinstance(o, decimal.Decimal):
            return float(o)
        return super(DecimalEncoder, self).default(o)


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
        "body": json.dumps(body, cls=DecimalEncoder),
    }


def apigateway_get_user_id(event) -> str:
    return event["requestContext"]["authorizer"]["claims"]["sub"]


def apigateway_get_object_id(event) -> str:
    return event["pathParameters"]["object_id"]
