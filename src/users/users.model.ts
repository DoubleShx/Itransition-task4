import { ApiProperty } from "@nestjs/swagger";
import { Column, DataType, Model, Table } from "sequelize-typescript";

interface UserCreationAttributes {
    email: string;
    password: string
}

@Table({ tableName: 'users' })
export class User extends Model<User, UserCreationAttributes> {

    @ApiProperty({ example: '1', description: 'Уникальный' })
    @Column({ type: DataType.INTEGER, unique: true, autoIncrement: true, primaryKey: true })
    id: number;

    @ApiProperty({ example: 'test@mail.ru', description: 'Уникальный' })
    @Column({ type: DataType.STRING, unique: true, allowNull: false })
    email: string;

    @ApiProperty({ example: 'password' })
    @Column({ type: DataType.STRING, allowNull: false })
    password: string;

    @ApiProperty({ example: 'false', description: 'По дефолту false' })
    @Column({ type: DataType.BOOLEAN, defaultValue: false })
    banned: boolean;


    @ApiProperty({ example: 'null', description: 'По дефолту null' })
    @Column({ type: DataType.DATE, allowNull: true })
    lastLogin: Date;
}