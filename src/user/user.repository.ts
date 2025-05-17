import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { CreateUserDTO } from "./dto/create-user.dto";


@Injectable()
export class UserRepository {
    constructor(private prisma: PrismaService){}

    async createUser(data: CreateUserDTO) {
        return await this.prisma.user.create({
            data: data,
        });
    }

    async findUserByEmail(email: string) {
        return await this.prisma.user.findUnique({
            where: {
                email: email,
            },
        })
   
}


    async findyUserById(id: string){
        return await this.prisma.user.findUnique({
            where: {
            id: id,
            }
        })
    }

    async deleteUser(id: string){
        return await this.prisma.user.delete({
            where: {
                id: id,
            }
        })
    }

    async updateUser(id: string, data: CreateUserDTO) {
        return await this.prisma.user.update({
            where: {
                id: id,
            },
            data: data,
        });
    }


    async findAllUser() {
        return await this.prisma.user.findMany();
    }





}
