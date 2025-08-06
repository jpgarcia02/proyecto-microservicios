import { Category } from "src/categories/entities/category.entity";
import { DocumentVersionsService } from "src/document-versions/document-versions.service";
import { DocumentVersion } from "src/document-versions/entities/document-version.entity";
import { 
  Column, 
  CreateDateColumn, 
  Entity, 
  ManyToOne, 
  OneToMany, 
  PrimaryGeneratedColumn, 
  UpdateDateColumn 
} from "typeorm";

export enum DocumentStatus {
  ACTIVE = 'active',
  ARCHIVED = 'archived',
  DELETED = 'deleted'
}

@Entity()
export class Document {

  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  description: string;

  @ManyToOne(() => Category, category => category.documents, { nullable: false, onDelete: 'CASCADE' })
  category: Category;

  @Column({
    type: 'enum',
    enum: DocumentStatus,
    default: DocumentStatus.ACTIVE,
  })
  status: DocumentStatus;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToMany(() => DocumentVersion, version => version.document)
    versions: DocumentVersion;
}
