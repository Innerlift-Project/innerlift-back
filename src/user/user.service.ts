import { ConflictException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateUserDTO } from './dto/create-user.dto';
import * as bcrypt from 'bcrypt';
import { UserRepository } from './user.repository';
import { UserDto } from './dto/user.dto';
import { UpdateUserDTO } from './dto/update-user.dto';

@Injectable()
export class UserService {
  constructor(private readonly userRepository: UserRepository) {}

  async createUser(data: CreateUserDTO) {
    const existingUser = await this.userRepository.findUserByEmail(data.email);
    if (existingUser) {
      throw new ConflictException('User already exists');
    }

    return await this.userRepository.createUser(data);
  }

  async findUserByEmail(email: string) {
    const userByEmail = await this.userRepository.findUserByEmail(email);
    if (!userByEmail) {
      throw new ConflictException('User not found');
    }
    return userByEmail;
  }

  async findUserById(id: string) {
    const userById = await this.userRepository.findyUserById(id);
    if (!userById) {
      throw new ConflictException('User not found');
    }
    const user = new UserDto(userById);
    return user;
  }

  async deleteUser(id: string) {
    const user = await this.userRepository.findyUserById(id);
    if (!user) {
      throw new Error('User not found');
    }
    return this.userRepository.deleteUser(id);
  }

  async findAllUser(): Promise<UserDto[]> {
    const users = await this.userRepository.findAllUser();
    if (!users || users.length === 0) {
      throw new ConflictException('No users found');
    }
    return users.map((user) => new UserDto(user));
  }

  async updateUser(id: string, data: UpdateUserDTO) {
    const user = await this.userRepository.findyUserById(id);
    if (!user) {
      throw new ConflictException('User not found');
    }
    return await this.userRepository.updateUser(id, data);
  }
}
