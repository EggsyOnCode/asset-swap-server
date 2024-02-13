import { Module } from '@nestjs/common';
import { AwsUtilsService } from './aws-utils.service';
import { ConfigModule } from '@nestjs/config';

@Module({
  providers: [AwsUtilsService],
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: './libs/shared/src/nft-storage/src/.env',
    }),
  ],
  exports: [AwsUtilsService],
})
export class AwsUtilsModule {}
