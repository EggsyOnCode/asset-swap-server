import { Module } from '@nestjs/common';
import { NftStorageService } from './nft-storage.service';
import { ConfigModule } from '@nestjs/config';
import { EventEmitterModule } from '@nestjs/event-emitter';

@Module({
  providers: [NftStorageService],
  imports: [
    EventEmitterModule.forRoot(),
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: './libs/shared/src/nft-storage/src/.env',
    }),
  ],
  exports: [NftStorageService],
})
export class NftStorageModule {}
