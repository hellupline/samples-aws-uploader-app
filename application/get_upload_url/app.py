import json
import uuid
import os
import logging

from botocore.exceptions import ClientError
import boto3

BUCKET_NAME = os.environ["BUCKET_NAME"]
KEY_PREFIX = os.environ["KEY_PREFIX"]
EXPIRATION = 1200
s3_client = boto3.client("s3")

def lambda_handler(event, context):
    try:
        key = str(uuid.uuid4())
        response = generate_url(os.path.join(KEY_PREFIX, key))
        return response_success({"upload_url": response})
    except ClientError as e:
        logging.error(e)
        raise e


def generate_url(key_name):
    return s3_client.generate_presigned_url(
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
