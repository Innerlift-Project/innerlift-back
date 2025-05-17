import { Body, Controller, Delete, Get, Param, Post, Put, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { UpdateUserDTO } from './dto/update-user.dto';
import * as bcrypt from 'bcrypt';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}


    @Post()
    async createUser(@Body() data: {fullName: string, email: string, password: string }) {
        const hashedPassword = await bcrypt.hash(data.password, 10);    
        await this.userService.createUser({
                fullName: data.fullName,
                email: data.email,
                password: hashedPassword
        });
    }

    @UseGuards(JwtAuthGuard)
    @Get()
    async findAllUser() {
        return await this.userService.findAllUser();      
    }

    @Get("/id")
    async findUserById(@Body() data: {id: string}) {
        return await this.userService.findUserById(data.id);
    }

    @Get("/email")
    async findUserByEmail(@Body() data: {email: string}) {
        return await this.userService.findUserByEmail(data.email);
    }

    @Delete()
    async deleteUser(@Body() data: {id: string}) {
        return await this.userService.deleteUser(data.id);
    }

    @Put(':id')
     async updateUser(@Param('id') id: string, @Body() data: UpdateUserDTO){
        return await this.userService.updateUser(id, data);
     }


  





}
