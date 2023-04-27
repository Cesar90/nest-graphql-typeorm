import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { SignupInput, LoginInput } from './dto';
import { AuthResponse } from './types/auth-response.type';
import { UsersService } from '../users/users.service';
import { User } from '../users/entities/user.entity';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ){

  }

  private getJwtToken(userId: string){
    return this.jwtService.sign({ id: userId });
  }

  async signup(signupInput: SignupInput): Promise<AuthResponse> {
    //TODO: create user
    const user = await this.usersService.create(signupInput);
    //Todo: create token
    const token = this.getJwtToken(user.id);
    return {
      token,
      user
    }
    // throw new Error('Not implemented');
    // //TODO: create JWT
    // // console.log({signupInput})
    // // return {
    // //   token: 'fasdf',
    // //   user: new User()
    // // }
    // throw new Error('Not implemented');
  }

  async login(loginInput:LoginInput): Promise<AuthResponse>{
    const { email , password } = loginInput;
    const user = await this.usersService.findOneByEmail(email);
    if(!bcrypt.compareSync(password, user.password)){
      throw new BadRequestException('Email/Password do not match');
    }
    const token = this.getJwtToken(user.id);
    return {
      token,
      user
    }
  }

  async validateUser(id: string): Promise<User>{
    const user = await this.usersService.findOneById(id);
    if(!user.isActive){
      throw new UnauthorizedException(`User is inactive, talk with an admin`);
    }
    delete user.password;
    return user;
  }

  revalidateToken(user: User): AuthResponse{
    const token = this.getJwtToken(user.id);
    return { 
      token,
      user
     }
  }

}
