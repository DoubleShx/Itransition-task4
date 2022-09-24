import { ApiProperty } from "@nestjs/swagger";

export class BanUserDto {

    @ApiProperty({example: [1,2,3], description: 'id[]'})
    readonly userIds: number[];

    @ApiProperty({example: 'true', description: 'banned'})
    readonly banned: boolean;

}