// image.service.ts

import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from 'src/user.entity'; // Import your User entity

@Injectable()
export class ImageService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async saveProfilePicture(userId: number, imageBuffer: Buffer): Promise<User | null> {
    const user = await this.userRepository.findOne({where : {id: userId}});

    if (user) {
      user.profilePicture = imageBuffer; // Store the image data in the user entity
      return await this.userRepository.save(user); // Save the updated user
    }

    return null; // Handle the case when the user is not found
  }

  async getProfilePicture(userId: number): Promise<Buffer | null> {
    const user = await this.userRepository.findOne({where : {id: userId}});

    if (user && user.profilePicture) {
      return user.profilePicture; // Return the user's profile picture (Buffer)
    }

    return null; // Handle cases when the user or profile picture is not found
  }
}
