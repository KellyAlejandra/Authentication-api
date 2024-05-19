import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './strategy/jwt.strategy';
import { AuthController } from './auth.controller';



@Module({
  imports:[
    ConfigModule,
    TypeOrmModule.forFeature([User]),
    PassportModule.register({defaultStrategy:'jwt'}),
    JwtModule.registerAsync({
      imports:[ConfigModule],
      inject:[ConfigService],
      useFactory: (configService:ConfigService)=> {
        return {
          secret:configService.get('JWT_SECRET'),
          signOptions:{
            expiresIn: '2h'
          }
        }
      }
    })
  ],
  controllers: [AuthController],
  providers: [AuthService,JwtStrategy],
  exports:[TypeOrmModule,JwtStrategy, PassportModule, JwtModule],
})
export class AuthModule {}
