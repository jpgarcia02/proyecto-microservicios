import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule, ConfigService } from '@nestjs/config';

import { UsersModule } from '../users/users.module';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtStrategy } from './jwt.strategy';  // ← AGREGAR

@Module({
  imports: [
    ConfigModule,
    UsersModule,
    PassportModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (cs: ConfigService) => ({
        secret: cs.get<string>('JWT_SECRET') || 'ju@ng@rcia02',  // ← Fallback fijo
        signOptions: { 
          expiresIn: cs.get<string>('JWT_EXPIRES_IN') || '24h' 
        },
      }),
    }),
  ],
  providers: [AuthService, JwtStrategy],  // ← AGREGAR JwtStrategy
  controllers: [AuthController],
  exports: [AuthService, JwtStrategy],    // ← Exportar JwtStrategy también
})
export class AuthModule {}