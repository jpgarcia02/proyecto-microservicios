import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async register(registerDto: RegisterDto) {
    const user = await this.usersService.create(registerDto);
    return user;
  }

  async validateUser(loginDto: LoginDto) {
    const user = await this.usersService.findByEmail(loginDto.email);
    if (!user) return null;
    const isMatch = await bcrypt.compare(loginDto.password, user.password);
    if (!isMatch) return null;
    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }

  async login(loginDto: LoginDto) {
    const user = await this.validateUser(loginDto);
    if (!user) throw new UnauthorizedException('Credenciales inválidas');

    const payload = {
      sub: user.id,
      email: user.email,
    };

    // SOLO 'kid' y 'typ' en header, el algoritmo se define en options
    const access_token = this.jwtService.sign(payload, {
      algorithm: 'HS256',
      expiresIn: '24h',
      
    });

    return {
      access_token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
    };
  }
}