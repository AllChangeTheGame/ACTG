module "ecr" {
  source  = "terraform-aws-modules/ecr/aws"
  version = "2.4.0"

  repository_name = "${local.app_name}-backend"

  registry_scan_type                 = "BASIC"
  repository_read_write_access_arns  = ["arn:aws:iam::${local.account_id}:root"]
  repository_lambda_read_access_arns = [aws_lambda_function.lambda_backend.arn]
  repository_image_tag_mutability    = "MUTABLE"

  repository_lifecycle_policy = jsonencode({
    rules = [
      {
        rulePriority = 1,
        description  = "Keep last 30 images",
        selection = {
          tagStatus   = "any",
          countType   = "imageCountMoreThan",
          countNumber = 30
        },
        action = {
          type = "expire"
        }
      }
    ]
  })

  attach_repository_policy = true
}
