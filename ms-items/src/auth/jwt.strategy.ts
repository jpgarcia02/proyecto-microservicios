import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor() {
    super({
      // 1️⃣ Extraer token del header Authorization: Bearer <token>
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      
      // 2️⃣ No ignorar la expiración del token
      ignoreExpiration: false,
      
      // 3️⃣ Clave secreta EXACTAMENTE igual al API Gateway
      secretOrKey: 'SuperUltraS3cUr3-4p1-g4t3w4y-K3y!123', // ⚠️ CORREGIDO: era 'ju@ng@rcia02'
    });
  }

  // 4️⃣ Este método se ejecuta cuando el token es válido
  //    Lo que retornes aquí estará disponible en req.user
  async validate(payload: any) {
    return { 
      sub: payload.sub,        // userId
      email: payload.email 
    };
  }
}