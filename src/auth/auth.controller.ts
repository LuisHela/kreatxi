import { Body, Controller, Get, HttpStatus, Param, Post, Put, Query, Req, Res, UploadedFile, UseInterceptors } from '@nestjs/common';
import { Request, Response } from 'express';
import { AuthService } from './auth.service';
import { User } from 'src/user.entity';

import { FileInterceptor } from '@nestjs/platform-express/multer';




@Controller('auth')
export class AuthController {
  userService: any;
  constructor(
    private readonly authService: AuthService,
   
  ) {}

  @Post('register')
  @UseInterceptors(FileInterceptor('profilePicture'))
async register(@Req() req: Request, @Res() resp: Response, @UploadedFile() file) {
  try {
    const user = req.body;
    const birthday = new Date(req.body.birthday);

    // Save the image to the database using the ImageService
    const imageBuffer = file.buffer; // Get the image data from the uploaded file
    const savedUser = await this.authService.registerUser(user, resp, birthday, imageBuffer); // Pass the imageBuffer as the fourth argument

    return savedUser; // If your registerUser method returns the saved user
  } catch (error) {
    console.error(error);
    return resp.status(HttpStatus.INTERNAL_SERVER_ERROR).send({ message: 'An error occurred during registration.' });
  }
}

@Get('profile-picture/:userId')
async getProfilePicture(@Param('userId') userId: string, @Res() response: Response): Promise<void> {
  // Fetch the user profile picture from the database
  const userProfilePicture = await this.authService.getProfilePicture(parseInt(userId));

  if (userProfilePicture) {
    // Set the appropriate content type for the image (e.g., image/jpeg, image/png)
    response.setHeader('Content-Type', 'image/jpeg'); // Update with the correct content type

    // Send the image data as the response body
    response.send(userProfilePicture);
  } else {
    // Handle cases where the user or the profile picture is not found
    response.status(HttpStatus.NOT_FOUND).send('Profile picture not found');
  }
}


  @Post('/login')
  loginUser(@Body() user: User, @Res() res: Response) {
    return this.authService.loginUser(user, res);
  }

  @Get('/user')
  authUser(@Req() req: Request, @Res() resp: Response) {
    return this.authService.authUser(req, resp);
  }

  @Post('/refresh')
  refreshUser(@Req() req: Request, @Res() resp: Response) {
    return this.authService.refreshUser(req, resp);
  }

  @Get('/logout')
  logoutUser(@Res() resp: Response) {
    return this.authService.logoutUser(resp);
  }

  @Get('profile/:userId')
  async getUserProfile(@Param('userId') userId: string, @Res() response: Response): Promise<void> {
    try {
      const userProfile = await this.authService.getUserProfile(parseInt(userId));

      if (userProfile) {
        response.status(HttpStatus.OK).json(userProfile);
      } else {
        response.status(HttpStatus.NOT_FOUND).json({ message: 'User profile not found' });
      }
    } catch (error) {
      console.error(error);
      response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: 'An error occurred while fetching the user profile' });
    }
  }
  @Get('departments')
  async listDepartments(@Res() response: Response): Promise<void> {
    try {
      const departments = await this.authService.listDepartments();
  
      if (departments.length > 0) {
        response.status(HttpStatus.OK).json(departments);
      } else {
        response.status(HttpStatus.NOT_FOUND).json({ message: 'No departments found' });
      }
    } catch (error) {
      console.error(error);
      response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: 'Error listing departments' });
    }
  }

  

@Get('search-users')
async searchUsers(@Query('query') query: string, @Res() response: Response): Promise<void> {
  try {
    if (!query) {
      response.status(HttpStatus.BAD_REQUEST).json({ message: 'Query parameter is required' });
      return;
    }

    // Search users based on the provided query
    const users = await this.authService.searchUsers(query);

    if (users.length > 0) {
      response.status(HttpStatus.OK).json(users);
    } else {
      response.status(HttpStatus.NOT_FOUND).json({ message: 'No users found' });
    }
  } catch (error) {
    console.error(error);
    response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: 'Error searching users' });
  } 
}

@Put('profile/:userId')
async updateProfile(
  @Param('userId') userId: string,
  @Body() updatedProfile: User, // Assuming User is your user profile data structure
  @Res() response: Response
): Promise<void> {
  try {
    const updatedUser = await this.authService.updateUserProfile(userId, updatedProfile);

    if (updatedUser) {
      response.status(HttpStatus.OK).json(updatedUser);
    } else {
      response.status(HttpStatus.NOT_FOUND).json({ message: 'User profile not found' });
    }
  } catch (error) {
    console.error(error);
    response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: 'An error occurred while updating the user profile' });
  }
}




}


