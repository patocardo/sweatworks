variable "environment" {
  description = "Environment (staging or production)"
  type        = string
}

variable "aws_region" {
  description = "AWS region"
  type        = string
}

variable "s3_bucket_name" {
  description = "Name of the S3 bucket"
  type        = string
}

variable "ec2_user" {
  description = "Username for EC2 instance"
  type        = string
}

variable "ec2_ip" {
  description = "IP address of EC2 instance"
  type        = string
}

variable "public_key_path" {
  description = "Path to the public SSH key"
  type        = string
}

variable "images_bucket_name" {
  description = "Name of the bucket for storing original and processed images"
  type        = string
}
