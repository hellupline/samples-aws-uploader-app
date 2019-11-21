import os
import typing as T

import boto3

from uploader_utils import apigateway_response, apigateway_get_user_id


TABLE_FIELDS = (
    "storage_key",
    "user_id",
    "object_id",
    "filename",
    "content_type",
    "size",
    "created_at",
    "update_at",
)

TABLE_NAME = os.environ["TABLE_NAME"]

dynamodb = boto3.resource("dynamodb")
table = dynamodb.Table(TABLE_NAME)


def lambda_handler(event, context) -> T.Dict[str, T.Any]:
    user_id = apigateway_get_user_id(event)
    q = boto3.dynamodb.conditions.Key("user_id").eq(user_id)
    items = table.query(
        ProjectionExpression=", ".join(TABLE_FIELDS), KeyConditionExpression=q
    )["Items"]

    return apigateway_response({"items": items})
