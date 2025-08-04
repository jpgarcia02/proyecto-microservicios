import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor() {
    super({
      // 1️⃣ De dónde extraer el token
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),

      // 2️⃣ No ignorar la expiración del token
      ignoreExpiration: false,

      // 3️⃣ Clave secreta para validar la firma del JWT
      secretOrKey: process.env.JWT_SECRET || 'default_secret',
    });
  }

  // 4️⃣ Este método se ejecuta si el token es válido
  //    Lo que retornes estará en req.user
  async validate(payload: any) {
    return { userId: payload.sub, email: payload.email };
  }
}
