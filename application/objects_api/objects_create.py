import datetime
import json
import os
import typing as T
import uuid

import boto3

from uploader_utils import apigateway_response, apigateway_get_user_id


BUCKET_NAME = os.environ["BUCKET_NAME"]
KEY_PREFIX = os.environ["KEY_PREFIX"]
TABLE_NAME = os.environ["TABLE_NAME"]
EXPIRATION = 1200

s3 = boto3.client("s3")
dynamodb = boto3.resource("dynamodb")
table = dynamodb.Table(TABLE_NAME)


def lambda_handler(event, context) -> T.Dict[str, T.Any]:
    now = datetime.datetime.now(tz=datetime.timezone.utc).isoformat()
    user_id = apigateway_get_user_id(event)
    object_id = str(uuid.uuid4())
    storage_key = os.path.join(KEY_PREFIX, user_id, object_id)
    filename, content_type, size = get_file_data(event, object_id)
    item = {
        "storage_key": storage_key,
        "user_id": user_id,
        "object_id": object_id,
        "filename": filename,
        "content_type": content_type,
        "size": size,
        "created_at": now,
        "updated_at": now,
    }

    table.put_item(Item=item)
    upload_url = generate_upload_url(storage_key, content_type)
    return apigateway_response({"upload_url": upload_url, "item": item})


def generate_upload_url(key_name: str, content_type: str) -> str:
    return s3.generate_presigned_url(
        ClientMethod="put_object",
        Params={
            "Bucket": BUCKET_NAME,
            "Key": key_name,
            "ACL": "private",
            "ContentType": content_type,
        },
        ExpiresIn=EXPIRATION,
        HttpMethod="PUT",
    )


def get_file_data(event, object_id: str) -> T.Tuple[str, str, str]:
    payload = json.loads(event["body"])
    filename = payload.get("filename", object_id)
    content_type = payload.get("content_type", "octet/stream")
    size = payload.get("size", 0)
    if type(size) == str:
        if not size.isnumeric():
            raise TypeError(f"expected 'size' to be int, got {type(size)}")
        size = int(size)
    return filename, content_type, size
