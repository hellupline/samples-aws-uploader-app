import os
import typing as T

import boto3

from uploader_utils import (
    apigateway_response,
    apigateway_get_user_id,
    apigateway_get_object_id,
)


BUCKET_NAME = os.environ["BUCKET_NAME"]
KEY_PREFIX = os.environ["KEY_PREFIX"]
TABLE_NAME = os.environ["TABLE_NAME"]

s3 = boto3.client("s3")
dynamodb = boto3.resource("dynamodb")
table = dynamodb.Table(TABLE_NAME)


def lambda_handler(event, context) -> T.Dict[str, T.Any]:
    user_id = apigateway_get_user_id(event)
    object_id = apigateway_get_object_id(event)
    storage_key = os.path.join(KEY_PREFIX, user_id, object_id)

    table.delete_item(Key={"user_id": user_id, "object_id": object_id})
    s3.delete_object(Bucket=BUCKET_NAME, Key=storage_key)
    return apigateway_response({"sucess": True})
