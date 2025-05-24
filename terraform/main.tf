provider "aws" {
  region = "eu-west-2"
  default_tags {
    tags = local.tags
  }
}

locals {
  account_id = data.aws_caller_identity.current.account_id
  region     = data.aws_region.current.name
  app_name   = "actg-app"
  tags = {
    application = local.app_name
  }
}
