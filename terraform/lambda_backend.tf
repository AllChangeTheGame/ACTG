data "aws_iam_policy_document" "lambda_assume_policy" {
  statement {
    actions = ["sts:AssumeRole"]

    principals {
      type        = "Service"
      identifiers = ["lambda.amazonaws.com"]
    }

  }
}

data "aws_secretsmanager_secret" "rds_password" {
  arn = aws_db_instance.rds_instance.master_user_secret[0].secret_arn
}

data "aws_secretsmanager_secret_version" "rds_password" {
  secret_id = data.aws_secretsmanager_secret.rds_password.id
}

resource "aws_lambda_function" "lambda_backend" {
  function_name = "${local.app_name}-lambda"

  package_type  = "Image"
  image_uri     = "${module.ecr.repository_url}:latest"
  memory_size   = 256
  timeout       = 10
  architectures = ["x86_64"]

  role = aws_iam_role.lambda_backend.arn

  environment {
    variables = {
      DB_HOST     = aws_db_instance.rds_instance.address
      DB_PORT     = aws_db_instance.rds_instance.port
      DB_USER     = jsondecode(data.aws_secretsmanager_secret_version.rds_password.secret_string).username
      DB_PASSWORD = jsondecode(data.aws_secretsmanager_secret_version.rds_password.secret_string).password
      DB_NAME     = aws_db_instance.rds_instance.db_name

      STATIC_DATA_BUCKET_NAME = aws_s3_bucket.static_data_bucket.id
      FIREBASE_PROJECT_ID     = var.firebase_project_id
    }
  }

  vpc_config {
    security_group_ids = [data.aws_security_group.default.id]
    subnet_ids         = data.aws_subnets.default.ids
  }
}


resource "aws_iam_policy" "lambda_backend" {
  name = "${local.app_name}-lambda-policy"
  policy = templatefile("${path.module}/templates/lambda_policy.json", {
    static_data_bucket = aws_s3_bucket.static_data_bucket.arn
    }
  )
}

resource "aws_iam_role" "lambda_backend" {
  name               = "${local.app_name}-lambda-role"
  assume_role_policy = data.aws_iam_policy_document.lambda_assume_policy.json
}

resource "aws_iam_role_policy_attachment" "lambda_backend" {
  role       = aws_iam_role.lambda_backend.name
  policy_arn = resource.aws_iam_policy.lambda_backend.arn
}

resource "aws_lambda_permission" "apigw_lambda" {
  statement_id  = "AllowExecutionFromAPIGateway"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.lambda_backend.function_name
  principal     = "apigateway.amazonaws.com"

  # The /*/*/* part allows invocation from any stage, method and resource path
  # within API Gateway REST API.
  source_arn = "${module.api_gateway.apigatewayv2_api_execution_arn}/*/*/*"
}
