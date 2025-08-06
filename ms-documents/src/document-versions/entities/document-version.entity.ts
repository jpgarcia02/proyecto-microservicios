import { Document } from "src/documents/entities/document.entity";
import { 
  Column, 
  CreateDateColumn, 
  Entity, 
  ManyToOne, 
  PrimaryGeneratedColumn, 
  UpdateDateColumn 
} from "typeorm";

@Entity()
export class DocumentVersion {

  @PrimaryGeneratedColumn('uuid')
  id: string;

  // Relación con el documento principal
  @ManyToOne(() => Document, document => document.versions, { onDelete: 'CASCADE' })
  document: Document;

  // Número de versión (1, 2, 3...)
  @Column()
  versionNumber: number;

  // Nombre del archivo original
  @Column()
  fileName: string;

  // Ruta o URL del archivo en el almacenamiento
  @Column()
  filePath: string;

  // Tipo MIME del archivo (pdf, docx, etc.)
  @Column()
  mimeType: string;

  // Tamaño en bytes
  @Column()
  size: number;

  // Descripción opcional de los cambios
  @Column({ nullable: true })
  changeDescription?: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
