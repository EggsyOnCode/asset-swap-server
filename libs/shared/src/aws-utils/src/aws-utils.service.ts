import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import AWS from 'aws-sdk';

@Injectable()
export class AwsUtilsService {
  constructor(private readonly configService: ConfigService) {}
  AWS_S3_BUCKET = this.configService.get('bucket_name');
  s3 = new AWS.S3({
    accessKeyId: this.configService.get('IAM_ACCESS_key'),
    secretAccessKey: this.configService.get('IAM_ACCESS_key_secret'),
  });

  async uploadFile(file) {
    console.log(file);
    const { originalname } = file;

    return await this.s3_upload(
      file.buffer,
      this.AWS_S3_BUCKET,
      originalname,
      file.mimetype,
    );
  }

  async s3_upload(file, bucket, name, mimetype) {
    const params = {
      Bucket: bucket,
      Key: String(name),
      Body: file,
      ContentType: mimetype,
      ContentDisposition: 'inline',
      CreateBucketConfiguration: {
        LocationConstraint: 'us-east-1',
      },
    };

    try {
      const s3Response = await this.s3.upload(params).promise();
      return s3Response;
    } catch (e) {
      console.log(e);
    }
  }

  async fetchS3Object(object_key: string) {
    try {
      const response = await this.s3
        .getObject({
          Bucket: this.AWS_S3_BUCKET,
          Key: object_key,
        })
        .promise();

      return response.Body;
    } catch (error) {
      throw new Error('Error fetching S3 object: ' + error.message);
    }
  }
}
