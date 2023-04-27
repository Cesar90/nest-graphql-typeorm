import { UseGuards } from '@nestjs/common';
import { Mutation, Resolver, Query, Args } from '@nestjs/graphql';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { AuthGuard } from '@nestjs/passport';
import { AuthResponse } from './types/auth-response.type';
import { SignupInput, LoginInput } from './dto';
import { AuthService } from './auth.service';
import { CurrentUser } from './decorators/current-user.decorator';
import { User } from './../users/entities/user.entity';
import { ValidRoles } from './enums/valid-roles.enum';

@Resolver()
export class AuthResolver {
  constructor(private readonly authService: AuthService) {}

  @Mutation( () => AuthResponse  ,{ name: 'signup' })
  async signup(
    @Args('signupInput') signupInput: SignupInput
  ): Promise<AuthResponse>{
    return this.authService.signup(signupInput);
  }

  @Mutation(() => AuthResponse,{ name: 'login' })
  async login(
    @Args('loginInput') loginInput: LoginInput
  ): Promise<AuthResponse>{
    return this.authService.login(loginInput);
  }

  @Query(() => AuthResponse, { name: 'revalite' })
  @UseGuards( JwtAuthGuard )
  async revalidateToken(
    @CurrentUser(/*[ValidRoles.admin]*/) user: User
  ): Promise<AuthResponse>{
    return this.authService.revalidateToken(user);
    // console.log('revalidateToken, user', user);
    // throw new Error('No implemented');
  }
}
