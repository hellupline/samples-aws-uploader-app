STACK_NAME=hellupline-uploader-application

AWS_PROFILE=default
AWS_REGION=us-east-1

ARTIFACT_BUCKET_NAME=$$(aws ssm get-parameters \
		--profile=$(AWS_PROFILE) \
		--region=$(AWS_REGION) \
		--names=/core/build/artifact-store \
		--query='Parameters[].Value' \
		--output=text)

USERNAME=
PASSWORD=
USER_POOL_CLIENT_ID=

.PHONY: all cognito-login

all: packaged.yaml
	aws cloudformation deploy \
		--profile=$(AWS_PROFILE) \
		--region=$(AWS_REGION) \
		--capabilities=CAPABILITY_IAM \
		--no-fail-on-empty-changeset \
		--stack-name=$(STACK_NAME) \
		--template-file=$<

packaged.yaml: template.yaml create_upload_url/requirements.txt create_upload_url/app.py
	aws cloudformation package \
		--profile=$(AWS_PROFILE) \
		--region=$(AWS_REGION) \
		--s3-bucket=$(ARTIFACT_BUCKET_NAME) \
		--s3-prefix=cf-packages \
		--template-file=$< \
		--output-template-file=$@

cognito-login:
	@aws cognito-idp initiate-auth \
		--profile=$(AWS_PROFILE) \
		--region=$(AWS_REGION) \
		--auth-flow=USER_PASSWORD_AUTH \
		--auth-parameters='USERNAME="$(USERNAME)",PASSWORD="$(PASSWORD)"' \
		--client-id=$(USER_POOL_CLIENT_ID) \
		--query AuthenticationResult.IdToken \
		--output=text
