import { Global, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Asset } from 'apps/assets/src/entities/asset.schema';
import { User } from 'apps/auth/src/users/entities/user.schema';
import { UserAssets } from 'apps/auth/src/user-assets/entities/userAssets.schema';
import { UserAdvertized } from 'apps/auth/src/advertized-assets/entities/userAdvertised.schema';
import { Order } from 'apps/orders/src/entities/order.schema';
import { Notification } from 'apps/orders/src/notifications/entities/notification.schema';

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
        ssl: {
          rejectUnauthorized: false,
          require: true,
        },
        entities: [
          Asset,
          User,
          UserAssets,
          UserAdvertized,
          Order,
          Notification,
        ],
        logging: true,
      }),
      inject: [ConfigService],
    }),
  ],
})
export class DatabaseModule {}
