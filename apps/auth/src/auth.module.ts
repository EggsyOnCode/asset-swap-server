import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './services/auth.service';
import { AdvertizedAssetsModule } from './advertized-assets/advertized-assets.module';
import { UsersModule } from './users/users.module';
import { UserAssetsModule } from './user-assets/user-assets.module';
import { DatabaseModule } from '@app/shared';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './users/entities/user.schema';
import { UserAssets } from './user-assets/entities/userAssets.schema';
import { UserAdvertized } from './advertized-assets/entities/userAdvertised.schema';
import { PassportModule } from '@nestjs/passport';
import { UsersService } from './users/users.service';
import { LocalStrategy } from './services/local.strategy';

@Module({
  imports: [
    DatabaseModule,
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: './apps/auth/.env',
    }),
    TypeOrmModule.forFeature([User, UserAssets, UserAdvertized]),
    AdvertizedAssetsModule,
    UsersModule,
    UserAssetsModule,
    PassportModule,
  ],
  controllers: [AuthController],
  providers: [AuthService, LocalStrategy],
})
export class AuthModule {}
