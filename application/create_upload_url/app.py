import datetime
import json
import os
import uuid
import typing as T

import boto3


BUCKET_NAME = os.environ["BUCKET_NAME"]
KEY_PREFIX = os.environ["KEY_PREFIX"]
TABLE_NAME = os.environ["TABLE_NAME"]
EXPIRATION = 1200

s3 = boto3.client("s3")
dynamodb = boto3.resource("dynamodb")
table = dynamodb.Table(TABLE_NAME)


def lambda_handler(event, context) -> T.Dict[str, T.Any]:
    username = get_username(event)
    key = os.path.join(KEY_PREFIX, username, str(uuid.uuid4()))
    filename, content_type, size = get_file_data(event, key)
    item = {
        "UserId": username,
        "StorageKey": key,
        "Filename": filename,
        "ContentType": content_type,
        "Size": size,
        "CreatedAt": datetime.datetime.now(tz=datetime.timezone.utc).isoformat(),
        "UpdatedAt": datetime.datetime.now(tz=datetime.timezone.utc).isoformat(),
    }

    table.put_item(Item=item)
    response = generate_url(key, content_type)
    return response_success({"upload_url": response})


def get_username(event) -> str:
    return event["requestContext"]["authorizer"]["claims"]["cognito:username"]


def get_file_data(event, key) -> T.Tuple[str, str, str]:
    filename = event["queryStringParameters"].get("filename") or key
    content_type = event["queryStringParameters"].get("content_type") or "octet/stream"
    size = event["queryStringParameters"].get("size") or "0"
    if not size.isnumeric():
        raise TypeError(f"expected 'size' to be int, got {type(size)}")
    return filename, content_type, size


def generate_url(key_name, content_type) -> str:
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


def response_success(body) -> T.Dict[str, T.Any]:
    return {
        "statusCode": 200,
        "headers": {
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Headers": "origin, content-type, accept",
            "Access-Control-Allow-Credentials": "true",
            "Content-Type": "application/json",
        },
        "isBase64Encoded": False,
        "body": json.dumps(body),
    }
