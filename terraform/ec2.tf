# Create IAM role for EC2 instance
resource "aws_iam_policy" "ec2_policy" {
  name        = "maintainer-ec2-policy"
  description = "Policy for EC2"

  # Terraform's "jsonencode" function converts a
  # Terraform expression result to valid JSON syntax.
  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [{
      Effect = "Allow"
      Action = [
        "s3:*Object",
        "s3:ListBucket",
      ]
      Resource = [
        aws_s3_bucket.static_data_bucket.arn,
        "${aws_s3_bucket.static_data_bucket.arn}/*"
      ]
      },
      {
        Effect = "Allow"
        Action = [
          "s3:ListBuckets",
        ]
        Resource = ["*"]
      }
    ]

  })
}

resource "aws_iam_role" "ec2_role" {
  name = "EC2_SSM_Role"
  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Action = "sts:AssumeRole"
        Effect = "Allow"
        Sid    = ""
        Principal = {
          Service = "ec2.amazonaws.com"
        }
      },
    ]
  })
}

resource "aws_iam_role_policy_attachment" "ec2_role_ssm_managed" {
  role       = aws_iam_role.lambda_backend.name
  policy_arn = "arn:aws:iam::aws:policy/AmazonSSMManagedInstanceCore"
}

resource "aws_iam_role_policy_attachment" "ec2_role_ec2_policy" {
  role       = aws_iam_role.lambda_backend.name
  policy_arn = aws_iam_policy.ec2_policy.arn
}

resource "aws_security_group" "maintainer" {
  name        = "maintainer"
  description = "Allow maintainer inbound traffic"
  vpc_id      = data.aws_vpc.default.id

  ingress {
    description = "WebUI from anywhere"
    from_port   = 9000
    to_port     = 9000
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }
  # ingress {
  #   description = "SSH - Temp"
  #   from_port   = 22
  #   to_port     = 22
  #   protocol    = "tcp"
  #   cidr_blocks = ["86.178.251.224/32"]
  # }

  egress {
    description = "All traffic"
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }
}

# Create an instance profile for the EC2 instance and associate the IAM role
resource "aws_iam_instance_profile" "ec2_instance_profile" {
  name = "EC2_SSM_Instance_Profile"

  role = aws_iam_role.ec2_role.name
}

resource "aws_instance" "maintainer" {
  ami                    = "ami-0f427628f04bdeff0"
  instance_type          = "t4g.micro"
  iam_instance_profile   = aws_iam_instance_profile.ec2_instance_profile.name
  vpc_security_group_ids = [aws_security_group.maintainer.id, data.aws_security_group.default.id]
  key_name               = "actg-maintainer"
}
