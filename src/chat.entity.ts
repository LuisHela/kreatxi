import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    CreateDateColumn,
  } from 'typeorm';
  import { User } from './user.entity'; // Import the User entity
  
  @Entity()
  export class Chat {
    @PrimaryGeneratedColumn('increment')
    id: number;
  
    @Column()
    text: string;
  
    @CreateDateColumn()
    createdAt: Date;
  
    @ManyToOne(() => User, (user) => user.chats)
    user: User;
  }
  