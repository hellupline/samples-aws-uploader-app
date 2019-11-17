STACK_NAME=hellupline-uploader-application

AWS_PROFILE=default
AWS_REGION=us-east-1

.PHONY: settings

settings: src/settings.json

src/settings.json: get-stack-outputs.jq generate-settings.jq
	aws cloudformation describe-stacks \
		--profile=$(AWS_PROFILE) \
		--region=$(AWS_REGION) \
		--stack-name=$(STACK_NAME) \
	| ./get-stack-outputs.jq \
	| AWS_REGION=$(AWS_REGION) ./generate-settings.jq > $@
