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

  // 1️⃣ Registrar nuevo usuario
  async register(registerDto: RegisterDto) {
    // Delegamos la creación al UsersService (que ya hace hash)
    const user = await this.usersService.create(registerDto);
    return user; // Retornamos sin password
  }

  // 2️⃣ Validar credenciales para login
  async validateUser(loginDto: LoginDto) {
    const user = await this.usersService.findByEmail(loginDto.email);

    const isMatch = await bcrypt.compare(loginDto.password, user.password);
    if (!isMatch) {
      return null;
    }

    const { password: _, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }

  // 3️⃣ Generar token y devolver usuario logueado
  async login(loginDto: LoginDto) {
    const user = await this.validateUser(loginDto);
    if (!user) {
      throw new UnauthorizedException('Credenciales inválidas');
    }

    const payload = { sub: user.id, email: user.email };
    const token = await this.jwtService.signAsync(payload);

    return {
      access_token: token,
      user: { id: user.id, email: user.email },
    };
  }
}
