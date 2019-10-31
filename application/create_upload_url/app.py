import json
import uuid
import os

import boto3


BUCKET_NAME = os.environ["BUCKET_NAME"]
KEY_PREFIX = os.environ["KEY_PREFIX"]
TABLE_NAME = os.environ["TABLE_NAME"]
EXPIRATION = 1200

s3 = boto3.client("s3")
dynamodb = boto3.resource("dynamodb")
table = dynamodb.Table(TABLE_NAME)


def lambda_handler(event, context):
    key = os.path.join(KEY_PREFIX, get_user_prefix(event), str(uuid.uuid4()))
    fname = event["queryStringParameters"].get("name", key)
    ftype = event["queryStringParameters"].get("type", "octet/stream")
    size = event["queryStringParameters"].get("size", "0")
    if not size.isnumeric():
        raise TypeError(f"expected 'size' to be int, got {type(size)}")
    table.put_item(
        Item={
            "id": key,
            "owner": get_username(event),
            "name": fname,
            "type": ftype,
            "size": size,
        }
    )
    response = generate_url(key, ftype)
    return response_success({"upload_url": response})


def get_user_prefix(event):
    return event["requestContext"]["authorizer"]["claims"]["email"]


def get_username(event):
    return event["requestContext"]["authorizer"]["claims"]["cognito:username"]


def generate_url(key_name, content_type):
    return s3.generate_presigned_url(
        ClientMethod="put_object",
        Params={"Bucket": BUCKET_NAME, "Key": key_name, "ACL": "private"},
        ExpiresIn=EXPIRATION,
        HttpMethod="PUT",
    )


def response_success(body):
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
