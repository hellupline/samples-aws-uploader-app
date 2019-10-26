STACK_NAME=hellupline-uploader

AWS_PROFILE=default
AWS_REGION=us-east-1

APPLICATION_ARM_CERTIFICATION_ARN=
APPLICATION_DOMAIN_NAME=
WEBSITE_ARM_CERTIFICATION_ARN=
WEBSITE_DOMAIN_NAME=

ARTIFACT_BUCKET_NAME=$$(aws ssm get-parameters \
		--profile=$(AWS_PROFILE) \
		--region=$(AWS_REGION) \
		--names=/core/build/artifact-store \
		--query='Parameters[].Value' \
		--output=text)


all: packaged.yaml
	aws cloudformation deploy \
		--profile=$(AWS_PROFILE) \
		--region=$(AWS_REGION) \
		--capabilities=CAPABILITY_NAMED_IAM \
		--no-fail-on-empty-changeset \
		--stack-name=$(STACK_NAME) \
		--template-file=$< \
		--parameter-overrides \
			ApplicationAcmCertificateArn="$(APPLICATION_ARM_CERTIFICATION_ARN)" \
			ApplicationDomainName="$(APPLICATION_DOMAIN_NAME)"\
			WebsiteAcmCertificateArn="$(WEBSITE_ARM_CERTIFICATION_ARN)" \
			WebsiteDomainName="$(WEBSITE_DOMAIN_NAME)"

packaged.yaml: template.yaml code-pipeline.yaml website.yaml
	aws cloudformation package \
		--profile=$(AWS_PROFILE) \
		--region=$(AWS_REGION) \
		--s3-bucket=$(ARTIFACT_BUCKET_NAME) \
		--s3-prefix=cf-packages \
		--template-file=$< \
		--output-template-file=$@
