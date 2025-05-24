terraform {
  backend "s3" {
    bucket = "terraform-state-bucket-actg"
    key    = "terraform.tfstate"
    region = "eu-west-2"
  }
}
