import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from 'src/user/user.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {

    constructor(private jwt: JwtService, private userService: UserService){}

    async validateUser(email: string, password: string){
        const user = await this.userService.findUserByEmail(email);
        if(user && await bcrypt.compare(password, user.password)){
            const { password, ...result } = user;
            return result;
        }
        throw new UnauthorizedException('Invalid credentials');
    }

    async login(user: any) {
        const payload = { email: user.email, sub: user.id };
        return {
            access_token: this.jwt.sign(payload),
        };
    }

}
