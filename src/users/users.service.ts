import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { BanUserDto } from './dto/ban-user.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './users.model';

@Injectable()
export class UsersService {

    constructor(@InjectModel(User) private userRepository: typeof User) { }

    async createUser(dto: CreateUserDto) {
        const user = await this.userRepository.create(dto)
        return user
    }

    async getAllUsers() {
        const users = await this.userRepository.findAll()
        return users
    }

    async getUserByEmail(email: string) {
        const user = await this.userRepository.findOne({ where: { email }, include: { all: true } })
        return user
    }

    async loginUpdate(id: number) {
        const updatedLogin = await this.userRepository.update(
            { lastLogin: new Date() },
            {
                where: {
                    id,
                },
            }
        )
        return updatedLogin
    }

    async ban(dto: BanUserDto) {
        return this.userRepository.update(
            { banned: dto.banned },
            {
                where: {
                    id: dto.userIds,
                },
            }
        ).then(() => (this.userRepository.findAll()))
    }
}
