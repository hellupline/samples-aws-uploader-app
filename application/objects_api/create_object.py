import datetime
import os
import uuid
import typing as T

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
    file_id = str(uuid.uuid4())
    storage_key = os.path.join(KEY_PREFIX, user_id, file_id)
    filename, content_type, size = get_file_data(event, file_id)
    item = {
        "user_id": user_id,
        "filename": filename,
        "storage_key": storage_key,
        "content_type": content_type,
        "size": size,
        "created_at": now,
        "updated_at": now,
    }

    table.put_item(Item=item)
    upload_url = generate_url(storage_key, content_type)
    return apigateway_response({"upload_url": upload_url, "item": item})


def generate_url(key_name: str, content_type: str) -> str:
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


def get_file_data(event, file_id: str) -> T.Tuple[str, str, str]:
    filename = event["queryStringParameters"].get("filename") or file_id
    content_type = event["queryStringParameters"].get("content_type") or "octet/stream"
    size = event["queryStringParameters"].get("size") or "0"
    if not size.isnumeric():
        raise TypeError(f"expected 'size' to be int, got {type(size)}")
    return filename, content_type, size
