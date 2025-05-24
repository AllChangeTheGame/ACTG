locals {
  location_lambda_path = "${path.module}/../backend/lambdas/location_lambda"
}

resource "null_resource" "pip_install" {
  triggers = {
    shell_hash = "${sha256(file("${local.location_lambda_path}/requirements.txt"))}"
  }

  provisioner "local-exec" {
    command = <<EOT
python3 -m pip install \
--platform manylinux2014_x86_64 \
--implementation cp \
--python-version 3.10 \
--only-binary=:all: \
-r ${local.location_lambda_path}/requirements.txt \
-t ${local.location_lambda_path}
EOT
  }
}

data "archive_file" "zip_lambda_location" {
  type        = "zip"
  source_dir  = local.location_lambda_path
  output_path = "${path.module}/lambda_location.zip"
  depends_on  = [null_resource.pip_install]
}

resource "aws_lambda_function" "lambda_location" {
  function_name    = "${local.app_name}-location-lambda"
  filename         = data.archive_file.zip_lambda_location.output_path
  source_code_hash = data.archive_file.zip_lambda_location.output_base64sha256

  handler       = "location_lambda.handler"
  runtime       = "python3.10"
  timeout       = 10
  architectures = ["x86_64"]

  role = aws_iam_role.lambda_location.arn

  environment {
    variables = {
      DB_HOST     = aws_db_instance.rds_instance.address
      DB_PORT     = aws_db_instance.rds_instance.port
      DB_USER     = jsondecode(data.aws_secretsmanager_secret_version.rds_password.secret_string).username
      DB_PASSWORD = jsondecode(data.aws_secretsmanager_secret_version.rds_password.secret_string).password
      DB_NAME     = aws_db_instance.rds_instance.db_name
    }
  }

  vpc_config {
    security_group_ids = [data.aws_security_group.default.id]
    subnet_ids         = data.aws_subnets.default.ids
  }
}

resource "aws_lambda_function_url" "lambda_location" {
  function_name      = aws_lambda_function.lambda_location.function_name
  authorization_type = "NONE"
}

resource "aws_iam_policy" "lambda_location" {
  name = "${local.app_name}-location-lambda-policy"
  policy = templatefile("${path.module}/templates/location_lambda_policy.json", {}
  )
}

resource "aws_iam_role" "lambda_location" {
  name               = "${local.app_name}-location-lambda-role"
  assume_role_policy = data.aws_iam_policy_document.lambda_assume_policy.json
}

resource "aws_iam_role_policy_attachment" "lambda_location" {
  role       = aws_iam_role.lambda_location.name
  policy_arn = resource.aws_iam_policy.lambda_location.arn
}
