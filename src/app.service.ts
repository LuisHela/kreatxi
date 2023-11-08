import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Chat } from './chat.entity'; // Import Chat entity
import { User } from './user.entity'; // Import User entity

@Injectable()
export class AppService {
  constructor(
    @InjectRepository(Chat) private chatRepository: Repository<Chat>,
    @InjectRepository(User) private userRepository: Repository<User>,
  ) {}

  // Chat-specific methods
  async createChatMessage(chat: Chat): Promise<Chat> {
    return await this.chatRepository.save(chat);
  }

  async getChatMessages(): Promise<Chat[]> {
    return await this.chatRepository.find();
  }

  // User-specific methods
  async createUser(user: User): Promise<User> {
    return await this.userRepository.save(user);
  }

  async getUsers(): Promise<User[]> {
    return await this.userRepository.find();
  }
}
