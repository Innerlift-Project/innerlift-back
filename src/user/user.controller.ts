import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { UserService } from './user.service';
import { UpdateUserDTO } from './dto/update-user.dto';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}


    @Post()
    async createUser(@Body() data: {fullName: string, email: string, password: string }) {
            await this.userService.createUser({
                ...data
        })
    }

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
