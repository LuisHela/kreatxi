import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Chat } from './chat.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column()
  firstname: string; // Add firstname field

  @Column()
  lastname: string; // Add lastname field

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column({ type: 'date' })
  birthday: Date;

  @Column()
  phone: string; // Add phone field

  @Column()
  department: string; // Add department field

  @Column()
  role: string; // Add role field

  @Column({ type: 'longblob', nullable: true })
  profilePicture: Buffer;

  @OneToMany(() => Chat, (chat) => chat.user)
  chats: Chat[];
}
