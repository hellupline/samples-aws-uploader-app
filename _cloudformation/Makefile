GLOBAL_STACK_NAME=globals
STACK_NAME=hellupline-uploader

AWS_PROFILE=default
AWS_REGION=us-east-1

ARTIFACT_BUCKET_NAME=$$(aws ssm get-parameters \
		--profile=$(AWS_PROFILE) \
		--region=$(AWS_REGION) \
		--names /artifacts-store \
		--query 'Parameters[].Value' \
		--output text)


all: packaged.yaml
	aws cloudformation deploy \
		--profile=$(AWS_PROFILE) \
		--region=$(AWS_REGION) \
		--capabilities=CAPABILITY_NAMED_IAM \
		--no-fail-on-empty-changeset \
		--stack-name=$(STACK_NAME) \
		--template-file=$<

packaged.yaml: template.yaml code-pipeline.yaml website.yaml
	aws cloudformation package \
		--profile=$(AWS_PROFILE) \
		--region=$(AWS_REGION) \
		--s3-bucket=$(ARTIFACT_BUCKET_NAME) \
		--s3-prefix=cf-packages \
		--template-file=$< \
		--output-template-file=$@
