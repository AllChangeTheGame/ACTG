# provider "aws" {
#   region = "us-east-1"
#   alias  = "acm_provider"
#   default_tags {
#     tags = local.tags
#   }
# }

# locals {
#   apigw_origin_id = "apigw_origin"
# }

# module "static_web_app" {
#   source      = "cn-terraform/s3-static-website/aws"
#   version     = "1.0.9"
#   name_prefix = "${local.app_name}-frontend"

#   providers = {
#     aws.main         = aws
#     aws.acm_provider = aws.acm_provider
#   }

#   website_domain_name = var.domain_name

#   create_acm_certificate = true

#   create_route53_hosted_zone = true

#   website_server_side_encryption_configuration = {
#     rule = {
#       apply_server_side_encryption_by_default = {
#         sse_algorithm = "AES256"
#       }
#     }
#   }

#   www_website_redirect_enabled = false
#   log_bucket_force_destroy     = false

#   cloudfront_custom_error_responses = [{
#     error_caching_min_ttl = 300
#     error_code            = 403
#     response_code         = 200
#     response_page_path    = "/index.html"
#   }]

#   cloudfront_additional_origins = [{
#     domain_name          = replace(module.api_gateway.default_apigatewayv2_stage_invoke_url, "/^https?://([^/]*).*/", "$1")
#     origin_id            = local.apigw_origin_id
#     origin_ssl_protocols = [""]

#     custom_origin_config = {
#       http_port              = 80
#       https_port             = 443
#       origin_protocol_policy = "https-only"
#       origin_ssl_protocols   = ["TLSv1.2"]
#     }
#   }]

#   cloudfront_ordered_cache_behaviors = [{
#     path_pattern           = "/api/*"
#     target_origin_id       = local.apigw_origin_id
#     allowed_methods        = ["DELETE", "GET", "HEAD", "OPTIONS", "PATCH", "POST", "PUT"]
#     cached_methods         = ["GET", "HEAD"]
#     viewer_protocol_policy = "redirect-to-https"
#     compress               = true

#     default_ttl = 0
#     min_ttl     = 0
#     max_ttl     = 0

#     cache_policy_id          = "4135ea2d-6df8-44a3-9df3-4b5a84be39ad" # Managed-CachingDisabled
#     origin_request_policy_id = "b689b0a8-53d0-40ab-baf2-68738e2966ac" # Managed-AllViewerExceptHostHeader
#   }]

# }
