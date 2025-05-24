resource "aws_s3_bucket" "static_data_bucket" {
  bucket = "${local.app_name}-static-data-bucket-${local.account_id}"
}

# resource "aws_s3_bucket_policy" "firebase_restriction" {
#   bucket = aws_s3_bucket.static_data_bucket.id

#   policy = jsonencode({
#     Version = "2012-10-17",
#     Statement = [
#       {
#         Sid    = "DenyFirebaseToAllButLambdaRole",
#         Effect = "Deny",
#         Principal = "*",
#         Action = [
#           "s3:GetObject",
#           "s3:PutObject",
#           "s3:DeleteObject"
#         ],
#         Resource = "${aws_s3_bucket.static_data_bucket.arn}/firebase/*"
#         Condition = {
#           StringNotEquals = {
#             "aws:PrincipalArn" = aws_iam_role.lambda_backend.arn
#           }
#         }
#       }
#     ]
#   })
# }
