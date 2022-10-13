import { HttpException, HttpStatus, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { UsersService } from 'src/users/users.service';
import * as bcrypt from 'bcryptjs'
import { User } from 'src/users/users.model';

@Injectable()
export class AuthService {

    constructor(
        private userService: UsersService,
        private jwtService: JwtService
    ) { }

    async login(userDto: CreateUserDto) {
        const user = await this.validateUser(userDto)
        return this.generateToken(user)
    }

    async registration(userDto: CreateUserDto) {
        const candidate = await this.userService.getUserByEmail(userDto.email)
        if (candidate) {
            throw new HttpException('Пользователь с таким email существует', HttpStatus.BAD_REQUEST)
        }
        const hashPassword = await bcrypt.hash(userDto.password, 5)
        this.userService.createUser({ ...userDto, password: hashPassword })
        return userDto;
    }

    private async generateToken(user: User) {
        const payload = { email: user.email, id: user.id }
        return {
            token:  this.jwtService.sign(payload)
        }
    }

    private async validateUser(userDto: CreateUserDto) {
        const user = await this.userService.getUserByEmail(userDto.email)
        if (!user) {
            throw new HttpException('Неккорректная почта', HttpStatus.BAD_REQUEST)
        }
        else {
            const isBanned = user.getDataValue('banned')
            const passwordEquals = await bcrypt.compare(userDto.password, user.password)
            if (passwordEquals && !isBanned) {
                let loginUpdate = await this.userService.loginUpdate(user.getDataValue('id')).then((res => (user)))
                return loginUpdate
            }
            throw new HttpException('Неккоректный пароль или пользователь заблокирован', HttpStatus.BAD_REQUEST)
        }
    }

}