import { Document } from "src/documents/entities/document.entity";
import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity()
export class Category {

    @PrimaryGeneratedColumn('uuid')
    id:string

    @Column({unique: true})
    name: string

    @Column()
    description: string

    @OneToMany(()=>Document,documents =>documents.category)
    documents: Document[]


    @CreateDateColumn()
      createdAt: Date;
    
      @UpdateDateColumn()
      updatedAt: Date;
    }


