import {Column, Entity, PrimaryGeneratedColumn} from "typeorm";
import {ApiProperty} from "@nestjs/swagger";
import {BigNumberTransformer} from "../database/big-number.transformer";
import {BigNumber} from "bignumber.js";
import {UserEntity} from "./user.entity";
import {timestamp} from "rxjs";

@Entity({name:"t_user_evo_order"})
export class UserEvoOrderEntity{
    @ApiProperty()
    @PrimaryGeneratedColumn()
    id: number;
    @Column()
    public createdAt: Date;
    @Column()
    public updatedAt: Date;
    @Column()
    public createdDateAt: Date;
    @Column()
    public updatedDateAt: Date;
    @Column()
    userId:number;
    @Column()
    address:string;
    @Column()
    shareAmount:number;

    @Column({
        type:'decimal',
        transformer:new BigNumberTransformer()
    })
    evoAmount:BigNumber;

    @Column({
        type:'decimal',
        transformer:new BigNumberTransformer()
    })
    usdtAmount:BigNumber;
    @Column()
    hash:string;

    public static from(params:{
                           user:UserEntity,
                           shareAmount:number,
                           evoAmount:BigNumber,
                           usdtAmount:BigNumber,
                            timestamp:number,
                            hash:string
    }){
        const userEvoOrderEntity = new UserEvoOrderEntity();
        userEvoOrderEntity.userId = params.user.id;
        userEvoOrderEntity.address = params.user.address;
        userEvoOrderEntity.evoAmount = params.evoAmount;
        userEvoOrderEntity.shareAmount = params.shareAmount;
        userEvoOrderEntity.usdtAmount = params.usdtAmount;
        const now =  new Date( params.timestamp + 8 * 3600 * 1000);
        userEvoOrderEntity.createdAt = now;
        userEvoOrderEntity.createdDateAt = now;
        userEvoOrderEntity.updatedAt = now;
        userEvoOrderEntity.updatedDateAt = now;
        userEvoOrderEntity.hash = params.hash;
        return userEvoOrderEntity;
    }
}