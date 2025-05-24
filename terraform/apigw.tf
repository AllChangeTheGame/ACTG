module "api_gateway" {
  source  = "terraform-aws-modules/apigateway-v2/aws"
  version = "2.2.2"

  name          = "${local.app_name}-apigw"
  description   = "ACTG API GW"
  protocol_type = "HTTP"

  cors_configuration = {
    allow_headers = ["content-type", "x-amz-date", "authorization", "x-api-key", "x-amz-security-token", "x-amz-user-agent"]
    allow_methods = ["*"]
    allow_origins = ["*"]
  }

  create_api_domain_name = false

  # Access logs
  default_stage_access_log_destination_arn = aws_cloudwatch_log_group.apigw_logs.arn
  default_stage_access_log_format          = "$context.identity.sourceIp - - [$context.requestTime] \"$context.httpMethod $context.routeKey $context.protocol\" $context.status $context.responseLength $context.requestId $context.integrationErrorMessage"

  # Routes and integrations
  integrations = {
    "ANY /{proxy+}" = {
      lambda_arn             = aws_lambda_function.lambda_backend.arn
      integration_type       = "AWS_PROXY"
      timeout_milliseconds   = 10000
      payload_format_version = "2.0"
      authorization_type     = "JWT"
      authorizer_key         = "firebase"
    }
  }

  authorizers = {
    # "lambda_firebase" = {
    #   authorizer_type         = "REQUEST"
    #   authorizer_uri          = aws_lambda_function.api_key_auth.invoke_arn
    #   identity_sources        = ["$request.header.x-api-key"]
    #   name                    = "api-key-lambda-auth"
    #   payload_format_version  = "2.0"
    #   enable_simple_responses = true
    # },
    "firebase" = {
      authorizer_type  = "JWT"
      identity_sources = "$request.header.Authorization"
      name             = "firebase-auth"
      audience         = ["actg-7a9fb"]
      issuer           = "https://securetoken.google.com/actg-7a9fb"
    }
  }
}

resource "aws_cloudwatch_log_group" "apigw_logs" {
  name = "${local.app_name}-apigw-access-log"
}
