import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class User {
  // ID como UUID
  @PrimaryGeneratedColumn('uuid')
  id: string;

  // Nombre obligatorio
  @Column()
  name: string;

  // Email único
  @Column({ unique: true })
  email: string;

  // Password en texto hash (bcrypt)
  @Column()
  password: string;
}
