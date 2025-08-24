import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { JwtService } from "@nestjs/jwt";
import { IJwtPayload } from "src/type/types";

@Injectable()
export class TokenService {
  private readonly jwtService: JwtService;

  constructor(private readonly configService: ConfigService) {
    this.jwtService = new JwtService({
      secret: this.configService.get<string>('JWT_SECRET'),
      signOptions: {
        expiresIn: this.configService.get<string | number>('JWT_EXPIRES_IN'),
      },
    });
  }

  generateJwtToken(payload: IJwtPayload): string {
    return this.jwtService.sign(payload);
  }
}
