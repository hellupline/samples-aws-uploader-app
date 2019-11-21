import os
import typing as T

import boto3

from uploader_utils import apigateway_response, apigateway_get_user_id, apigateway_get_object_id


BUCKET_NAME = os.environ["BUCKET_NAME"]
KEY_PREFIX = os.environ["KEY_PREFIX"]
TABLE_NAME = os.environ["TABLE_NAME"]
EXPIRATION = 1200

s3 = boto3.client("s3")
dynamodb = boto3.resource("dynamodb")
table = dynamodb.Table(TABLE_NAME)

FIELDS = (
    "updated_at",
    "created_at",
    "user_id",
    "object_id",
    "filename",
    "content_type",
    "size",
    "storage_key",
)


def lambda_handler(event, context) -> T.Dict[str, T.Any]:
    user_id = apigateway_get_user_id(event)
    object_id = apigateway_get_object_id(event)

    key = {"user_id": user_id, "object_id": object_id}
    expression = ", ".join(FIELDS)

    item = table.get_item(Key=key, ProjectionExpression=expression)["Item"]
    return apigateway_response({"item": item})
