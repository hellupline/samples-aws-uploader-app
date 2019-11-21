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

FIELDS = ("storage_key",)


def lambda_handler(event, context) -> T.Dict[str, T.Any]:
    user_id = apigateway_get_user_id(event)
    object_id = apigateway_get_object_id(event)

    key = {"user_id": user_id, "object_id": object_id}
    expression = ", ".join(FIELDS)

    item = table.get_item(Key=key, ProjectionExpression=expression)["Item"]
    storage_key = item["storage_key"]

    download_url = generate_url(storage_key)
    return apigateway_response({"download_url": download_url})


def generate_url(key_name: str) -> str:
    return s3.generate_presigned_url(
        ClientMethod="get_object",
        Params={"Bucket": BUCKET_NAME, "Key": key_name},
        ExpiresIn=EXPIRATION,
        HttpMethod="GET",
    )
