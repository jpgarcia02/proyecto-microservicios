import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsersModule } from 'src/users/users.module';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './jwt.strategy';

@Module({
  imports: [
    UsersModule,
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.register({
      secret: 'SuperUltraS3cUr3-4p1-g4t3w4y-K3y!123',
      signOptions: { algorithm: 'HS256', issuer: 'ms-users' },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy], // <- AQUI AGREGA ESTO
  exports: [AuthService],
})
export class AuthModule {}
