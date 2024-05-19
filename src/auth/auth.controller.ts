import { Body, Controller, Get, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto, LoginUserDto } from './dtos';
import { Auth, GetUser } from './decorators';
import { User } from './entities/user.entity';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @Post('register')
    create(@Body() creatUserDto: CreateUserDto) {
      return this.authService.create(creatUserDto);
    }
  
    @Post('login')
    login(@Body() loginUserDto: LoginUserDto) {
      return this.authService.login(loginUserDto);
    }
  
    @Get('check-status')
    @Auth()
    checkAuthStatus(
      @GetUser() user:User
    ){
      return this.authService.checkAuthStatus( user );
    }
}
