resource "aws_db_parameter_group" "this" {
  name_prefix = "pg-max-connections"
  family      = "postgres17"

  parameter {
    name         = "max_connections"
    value        = "500"
    apply_method = "pending-reboot"
  }

  lifecycle {
    create_before_destroy = true
  }
}

resource "aws_db_instance" "rds_instance" {
  identifier                  = "${local.app_name}-rds-instance"
  instance_class              = "db.t4g.micro"
  allocated_storage           = 20
  engine                      = "postgres"
  engine_version              = "17.4"
  username                    = "postgres"
  db_name                     = "postgres"
  manage_master_user_password = true
  # db_subnet_group_name = aws_db_subnet_group.rds_subnet_group.name
  publicly_accessible     = false
  backup_retention_period = 5
  # Parameter groups
  parameter_group_name = aws_db_parameter_group.this.name
  apply_immediately    = true
}

resource "aws_secretsmanager_secret_rotation" "rds_instance" {
  secret_id = aws_db_instance.rds_instance.master_user_secret[0].secret_arn

  rotation_rules {
    automatically_after_days = 999
  }
}
