import { Injectable, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { Request, Response } from 'express';
import { sign, verify } from 'jsonwebtoken';
import { User } from 'src/user.entity';
import { Repository, Like } from 'typeorm';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
  ) {}

  async getUserById(userId: number): Promise<User | undefined> {
    return this.userRepository.findOne({ where: { id: userId } });
  }

  async getProfilePicture(userId: number): Promise<Buffer | null> {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (user && user.profilePicture) {
      return user.profilePicture;
    }
    return null;
  }

  async registerUser(user: User, resp: Response, birthday: Date, profilePicture: Buffer) {
    const { firstname, lastname,phone,department,role, email, password } = user;

    // Check for required fields
    if (!firstname|| !lastname || !phone||!role|| !email || !password || !birthday) {
      return resp.status(HttpStatus.BAD_REQUEST).send({ message: 'Not all required fields have been provided.' });
    }

    try {
      // Save the profile picture if it's provided
      let newUser = new User();
      newUser.firstname = firstname;
      newUser.lastname = lastname;
      newUser.phone = phone;
      newUser.department = department;
      newUser.role = role;
      newUser.email = email;
      newUser.password = await bcrypt.hash(password, 12);
      newUser.birthday = birthday;
      newUser.profilePicture = profilePicture;

      newUser = await this.userRepository.save(newUser);

      return resp.status(HttpStatus.OK).send(newUser);
    } catch (error) {
      console.error(error);

      // Handle any errors during the save process
      return resp.status(HttpStatus.INTERNAL_SERVER_ERROR).send({ message: 'An error occurred during registration.' });
    }
  }

  
  
  
  // LOGIN USER
  async loginUser(user: User, resp: Response) {
    const { email, password } = user;
  
    // check for required fields
    if (!email?.trim() || !password?.trim()) {
      return resp
        .status(500)
        .send({ message: 'Not all required fields have been filled in.' });
    }
  
    const userDB = await this.userRepository.findOne({ where: { email } });
  
    // user not found or wrong password
    if (!userDB || !(await bcrypt.compare(password, userDB.password))) {
      return resp.status(500).send({ message: 'Invalid Credentials.' });
    }
  
    const accessToken = sign({ id: userDB.id }, 'access_secret', {
      expiresIn: 60 * 60,
    });
  
    const refreshToken = sign({ id: userDB.id }, 'refresh_secret', {
      expiresIn: 24 * 60 * 60,
    });
  
    resp.cookie('accessToken', accessToken, {
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000, // 1 day
    });
  
    resp.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });
  
    resp.status(200).send({
      message: 'Login success',
      role: userDB.role,
      userId: userDB.id, // Include the user's ID in the response
    });
  }

  // AUTH USER
  async authUser(req: Request, resp: Response) {
    try {
      const accessToken = req.cookies['accessToken'];

      const payload: any = verify(accessToken, 'access_secret');

      if (!payload) {
        return resp.status(401).send({ message: 'Unauthenticated.' });
      }

      const user = await this.userRepository.findOne({
        where: { id: payload.id },
      });

      if (!user) {
        return resp.status(401).send({ message: 'Unauthenticated.' });
      }

      return resp.status(200).send(user);
    } catch (error) {
      console.error(error);
      return resp.status(500).send({ message: error });
    }
  }

  async refreshUser(req: Request, resp: Response) {
    try {
      const refreshToken = req.cookies['refreshToken'];

      const payload: any = verify(refreshToken, 'refresh_secret');

      if (!payload) {
        return resp.status(401).send({ message: 'Unauthenticated.' });
      }

      const accessToken = sign({ id: payload.id }, 'access_secret', {
        expiresIn: 60 * 60,
      });

      resp.cookie('accessToken', accessToken, {
        httpOnly: true,
        maxAge: 24 * 60 * 60 * 1000,
      });

      resp.status(200).send({ message: 'refresh success.' });
    } catch (error) {
      console.error(error);
      return resp.status(500).send({ message: error });
    }
  }

  // LOGOUT USER
  async logoutUser(resp: Response) {
    resp.cookie('accessToken', '', { maxAge: 0 });
    resp.cookie('refreshToken', '', { maxAge: 0 });

    return resp.status(200).send({ message: 'Logged out.' });
  }


  async getUserProfile(userId: number): Promise<Partial<User> | null> {
    try {
      const user = await this.userRepository.findOne({ where: { id: userId } });

      if (user) {
        // Return only the necessary profile information
        const userProfile = {
          id: user.id,
          firstname: user.firstname,
          lastname: user.lastname,
          phone: user.phone,
          profilePicture: user.profilePicture,
        };

        return userProfile;
      }

      return null;
    } catch (error) {
      console.error(error);
      throw new Error('Error while fetching user profile');
    }
  }

  

  
  async searchUsers(query: string): Promise<User[] | null> {
    try {
      // Use a query to search for users whose firstname or lastname contains the provided query
      const users = await this.userRepository.find({
        where: [
          { firstname: Like(`%${query}%`) },
          { lastname: Like(`%${query}%`) },
        ],
      });
      return users;
    } catch (error) {
      console.error(error);
      throw new Error('Error while searching users');
    }
  }

  async listDepartments(): Promise<string[]> {
    try {
      // Query the database to retrieve unique department values
      const departments = await this.userRepository
        .createQueryBuilder()
        .select('DISTINCT "department" as "department"')
        .getRawMany();

      return departments.map((d) => d.department);
    } catch (error) {
      console.error(error);
      throw new Error('Error listing departments');
    }
  }

  async updateUserProfile(userId: string, updatedProfile: Partial<User>): Promise<User | null> {
    try {
      const userIdNum = parseInt(userId, 10);
       const user = await this.userRepository.findOne({ where: { id: userIdNum } });
     

      if (!user) {
        return null; // User not found
      }

      // Update user profile with the provided data
      user.firstname = updatedProfile.firstname || user.firstname;
      user.lastname = updatedProfile.lastname || user.lastname;
      user.phone = updatedProfile.phone || user.phone;
      user.department = updatedProfile.department || user.department;
      user.role = updatedProfile.role || user.role;
      user.email = updatedProfile.email || user.email;

      if (updatedProfile.password) {
        user.password = await bcrypt.hash(updatedProfile.password, 12);
      }

      user.birthday = updatedProfile.birthday || user.birthday;
      user.profilePicture = updatedProfile.profilePicture || user.profilePicture;

      // Save the updated user profile
      const updatedUser = await this.userRepository.save(user);
      return updatedUser;
    } catch (error) {
      console.error(error);
      throw new Error('Error while updating user profile');
    }
  }

  
}
  


