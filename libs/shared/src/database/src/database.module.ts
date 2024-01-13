import { Global, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Asset } from 'apps/assets/src/entities/asset.schema';
import { BaseAbstractRepository } from './abstract.repository';
import { User } from 'apps/auth/src/users/entities/user.schema';
import { UserAssets } from 'apps/auth/src/user-assets/entities/userAssets.schema';
import { UserAdvertized } from 'apps/auth/src/advertized-assets/entities/userAdvertised.schema';
import { Order } from 'apps/orders/src/entities/order.schema';

@Global()
@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.getOrThrow('DB_HOST'),
        port: configService.getOrThrow('DB_PORT'),
        database: configService.getOrThrow('POSTGRES_DB'),
        username: configService.getOrThrow('POSTGRES_USER'),
        password: configService.getOrThrow('POSTGRES_PASSWORD'),
        synchronize: configService.getOrThrow('DB_SYNC'),
        entities: [Asset, User, UserAssets, UserAdvertized, Order],
        logging: true,
      }),
      inject: [ConfigService],
    }),
  ],
})
export class DatabaseModule {}
