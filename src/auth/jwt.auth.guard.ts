import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { InjectModel } from "@nestjs/sequelize";
import {Reflector} from "@nestjs/core";
import { User } from 'src/users/users.model';


@Injectable()
export class JwtAuthGuard implements CanActivate {

    constructor(private jwtService: JwtService, @InjectModel(User) private userRepository: typeof User, private reflector: Reflector) { }

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const req = context.switchToHttp().getRequest()
        try {
            const authHeader = req.headers.authorization;
            const bearer = authHeader.split(' ')[0]
            const token = authHeader.split(' ')[1]

            if (bearer !== 'Bearer' || !token) {
                throw new UnauthorizedException({ message: 'Пользователь не авторизован' })
            }

            const user = this.jwtService.verify(token)


            let isBanned = await this.userRepository.findByPk(user.id).then((res:any) => (res.dataValues.banned)).catch(err => (true))
            // req.user = user
            return !isBanned
        }
        catch (e) {
            throw new UnauthorizedException({ message: 'Пользователь не авторизован' })
        }

    }

}