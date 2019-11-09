STACK_NAME=hellupline-uploader

AWS_PROFILE=default
AWS_REGION=us-east-1

ARTIFACT_BUCKET_NAME=$$(aws ssm get-parameters \
		--profile=$(AWS_PROFILE) \
		--region=$(AWS_REGION) \
		--names=/core/build/artifact-store \
		--query='Parameters[].Value' \
		--output=text)

.PHONY: all deploy resources status events

all: | deploy resources status events

deploy: packaged.yaml
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

resouces:
	@aws cloudformation describe-stack-resources \
		--profile=$(AWS_PROFILE) \
		--region=$(AWS_REGION) \
		--stack-name=$(STACK_NAME) \
		--query='StackResources[].{LogicalResourceId: LogicalResourceId, PhysicalResourceId: PhysicalResourceId, ResourceStatus: ResourceStatus}' \
		--output=table

status:
	@aws cloudformation describe-stacks \
		--profile=$(AWS_PROFILE) \
		--region=$(AWS_REGION) \
		--stack-name=$(STACK_NAME) \
		--query='Stacks[].Outputs[].{OutputKey: OutputKey, Description: Description, OutputValue: OutputValue}' \
		--output=table

events:
	@aws cloudformation describe-stack-events \
		--profile=$(AWS_PROFILE) \
		--region=$(AWS_REGION) \
		--stack-name=$(STACK_NAME) \
		--query='StackEvents[].{LogicalResourceId: LogicalResourceId, ResourceType: ResourceType, ResourceStatus: ResourceStatus}' \
		--output=table
