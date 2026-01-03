import { Injectable, UnauthorizedException } from '@nestjs/common'
import { UsersService } from '../users/users.service'
import * as bcrypt from 'bcrypt'
import { JwtService } from '@nestjs/jwt'

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async register(data: any) {
    const hash = await bcrypt.hash(data.password, 10)
    const isDev = process.env.NODE_ENV !== 'production';
    const role = isDev && data.email === 'elvismanzi16@gmail.com'? 'admin' : 'user';

    const user = await this.usersService.create({
      email: data.email,
      username: data.username,
      passwordHash: hash,
      role,
    });
    return this.signToken(user.id, user.role)
  }

  async login(email: string, password: string) {
    const user = await this.usersService.findByEmail(email)
    if (!user) throw new UnauthorizedException()

    const match = await bcrypt.compare(password, user.passwordHash)
    if (!match) throw new UnauthorizedException()

    return this.signToken(user.id, user.role)
  }

  private signToken(userId: string, role: string) {
    return {
      access_token: this.jwtService.sign({
        sub: userId,
        role,
      }),
    }
  }
}