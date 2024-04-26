import { ApiProperty } from "@nestjs/swagger";
import { Entity, Column, PrimaryGeneratedColumn } from "typeorm";

@Entity({ name: "users" })
class UserEntity {
    @ApiProperty({ description: "The id of the user" })
    @PrimaryGeneratedColumn()
    id: number;

    @ApiProperty({ description: "The UUID of the user" })
    @Column({ type: "uuid", unique: true })
    user_uuid: string;

    @ApiProperty({ description: "The name of the user" })
    @Column({ type: "text" })
    name: string;

    @ApiProperty({ description: "The email of the user" })
    @Column({ type: "text", unique: true })
    email: string;

    constructor(partial: Partial<UserEntity>) {
        Object.assign(this, partial);
    }
}

export { UserEntity as User };
