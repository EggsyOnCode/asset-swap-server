import { Module } from '@nestjs/common';
import { NftStorageService } from './nft-storage.service';
import { ConfigModule } from '@nestjs/config';

@Module({
  providers: [NftStorageService],
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: './libs/shared/src/nft-storage/src/.env',
    }),
  ],
  exports: [NftStorageService],
})
export class NftStorageModule {}
