import {
    Column,
    CreateDateColumn,
    Entity,
    JoinTable,
    ManyToMany,
    OneToMany,
    PrimaryGeneratedColumn,
    Unique,
} from 'typeorm';
import {ApiProperty} from '@nestjs/swagger';
import {RandomGenerator} from "typeorm/util/RandomGenerator";
import { randomString } from 'src/utils/random';


export enum UserStatus {
    Available = "Available",
    Ban = "Ban"
}

@Entity({name: "t_user"})
export class UserEntity {

    @ApiProperty()
    @PrimaryGeneratedColumn()
    id: number;
    @CreateDateColumn({
        type: 'timestamp',
        default: () => 'CURRENT_TIMESTAMP(6)',
    })

    @Column()
    public createdAt: Date;

    @Column()
    public updatedAt: Date;
    @Column()
    public createdDateAt: Date;
    @Column()
    public updatedDateAt: Date;
    @Column()
    public address: string;
    @Column()
    public inviteCode: string;


    static from(params: { address: string, id?: number }) {
        const userEntity = new UserEntity();
        userEntity.address = params.address;
        if (params.id) {
            userEntity.id = params.id;
        }
        const date = new Date(Date.now() + 8 * 3600 * 1000);
        userEntity.updatedAt = date;
        userEntity.createdAt = date;
        userEntity.createdDateAt = date;
        userEntity.updatedDateAt = date;
        userEntity.inviteCode = randomString(6);
        return userEntity;

    }

}
