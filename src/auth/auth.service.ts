import { BadRequestException, Injectable, InternalServerErrorException, UnauthorizedException } from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';

import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from './interfaces/jwt-payload.interface';
import { CreateUserDto, LoginUserDto } from './dtos';


@Injectable()
export class AuthService {

  constructor(
    @InjectRepository(User)
    private readonly userRepository:Repository<User>,
    private readonly jwtService:JwtService
  ){}

  async create(createUserDto:CreateUserDto) {
    try {
      const {password,... userData} = createUserDto;
      const user = this.userRepository.create({
        ...userData,
        password: bcrypt.hashSync(password, 10)
      });
      await this.userRepository.save(user);
      return {
        ...user,
        token: this.getJwtToken({id:user.id})
      };
      
    } catch (error) {

      this.handleErrorException(error)
      
    }
  }

 async login(loginUserDto:LoginUserDto){
    const {email,password} = loginUserDto;

    const user = await  this.userRepository.findOne({
      where:{email},
       select: {email:true,password:true, id:true}
    });

    if(!user)
      throw new UnauthorizedException('Credentials are not vald (email)');

    if(!bcrypt.compareSync(password,user.password))
      throw new UnauthorizedException('Credentials are not vald (password)');
    
    
    return {
      user,
      token: this.getJwtToken({id:user.id})
    };
  }


  async checkAuthStatus(user:User){
    return {
      user,
      token: this.getJwtToken({id: user.id})
    }
  }

  private getJwtToken(payLoad:JwtPayload){
    const token = this.jwtService.sign(payLoad);
    return token;
  }


  handleErrorException(error){
    if(error.code === '23505')
      throw new BadRequestException(error.detail);

    throw new InternalServerErrorException('Please check server logs');
  }

 
}
