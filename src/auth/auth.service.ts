import { Injectable, UnauthorizedException } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import * as bcrypt from 'bcrypt'
import { UsersService } from '../users/users.service'

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async register(data: any) {
    const hash = await bcrypt.hash(data.password, 10)

    const user = await this.usersService.create({
      email: data.email,
      username: data.username,
      passwordHash: hash,
    })

    return this.signToken(user.id)
  }

  async login(email: string, password: string) {
    const user = await this.usersService.findByEmail(email)
    if (!user) throw new UnauthorizedException()

    const match = await bcrypt.compare(password, user.passwordHash)
    if (!match) throw new UnauthorizedException()

    return this.signToken(user.id)
  }

  private signToken(userId: string) {
    return {
      access_token: this.jwtService.sign({ sub: userId }),
    }
  }
}