import datetime
import json
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


def lambda_handler(event, context) -> T.Dict[str, T.Any]:
    updated_at = datetime.datetime.now(tz=datetime.timezone.utc).isoformat()

    user_id = apigateway_get_user_id(event)
    object_id = apigateway_get_object_id(event)

    payload = json.loads(event["body"])
    filename = payload.get("filename", "new-file")

    key = {"user_id": user_id, "object_id": object_id}
    expression = "set updated_at = :updated_at, filename = :filename"
    values = {"updated_at": updated_at, ":filename": filename}

    item = table.update_item(
        Key=key,
        UpdateExpression=expression,
        ExpressionAttributeValues=values,
        ReturnValues="UPDATED_NEW",
    )["item"]

    return apigateway_response({"item": item})
