import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Item {

    @PrimaryGeneratedColumn('uuid')
    id: string 

    @Column()
    name : string 

    @Column()
    description : string 

    @Column('uuid')
    userId: string
}
