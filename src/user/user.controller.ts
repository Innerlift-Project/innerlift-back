import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { UserService } from './user.service';
import { UpdateUserDTO } from './dto/update-user.dto';
import * as bcrypt from 'bcrypt';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { ApiBody, ApiConsumes, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CreateUserDTO } from './dto/create-user.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { UpdateUserWithFileDTO } from './dto/update-user-with-file';

@ApiTags('users')
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  @ApiOperation({ summary: 'crate a user' })
  async createUser(@Body() data: CreateUserDTO) {
    const hashedPassword = await bcrypt.hash(data.password, 10);
    await this.userService.createUser({
      fullName: data.fullName,
      email: data.email,
      password: hashedPassword,
    });
  }

  @ApiOperation({ summary: 'find all users' })
  @UseGuards(JwtAuthGuard)
  @Get()
  async findAllUser() {
    return await this.userService.findAllUser();
  }

  @ApiOperation({ summary: 'find user by id' })
  @Get('/id')
  async findUserById(@Body() data: { id: string }) {
    return await this.userService.findUserById(data.id);
  }

  @ApiOperation({ summary: 'find user by email' })
  @Get('/email')
  async findUserByEmail(@Body() data: { email: string }) {
    return await this.userService.findUserByEmail(data.email);
  }

  @ApiOperation({ summary: 'delete a user' })
  @Delete(':id')
  async deleteUser(@Param('id') id: string) {
    return await this.userService.deleteUser(id);
  }

  @ApiOperation({ summary: 'update a user' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({ type: UpdateUserWithFileDTO })
  @Put(':id')
  @UseInterceptors(
    FileInterceptor('profilePicture', {
      storage: diskStorage({
        destination: './uploads/profile-pictures',
        filename: (req, file, cb) => {
          const uniqueName = `${Date.now()}${extname(file.originalname)}`;
          cb(null, uniqueName);
        },
      }),
    }),
  )
  async updateUser(
    @Param('id') id: string,
    @UploadedFile() file: import('multer').File,
    @Body() data: UpdateUserWithFileDTO,
  ) {
    console.log('File received:', file);
    const profilePicture = file
      ? `uploads/profile-pictures/${file.filename}`
      : undefined;
    return await this.userService.updateUser(id, data, profilePicture);
  }
}
