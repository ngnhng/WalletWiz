import { Injectable, HttpException, HttpStatus } from "@nestjs/common";
import { User } from "./user.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(User)
        private userRepository: Repository<User>
    ) {}
    async getAll(): Promise<User[]> {
        try {
            return await this.userRepository.find();
        } catch (error) {
            throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
        }
    }

    async getById(id: string): Promise<User> {
        try {
            const idNumber = Number(id);
            return await this.userRepository.findOne({
                where: { id: idNumber },
            });
        } catch (error) {
            throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
        }
    }

    async create(user: User): Promise<User> {
        try {
            return await this.userRepository.save(user);
        } catch (error) {
            throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
        }
    }

    async update(id: string, user: User): Promise<User> {
        try {
            const idNumber = Number(id);
            await this.userRepository.update(idNumber, user);
            return await this.userRepository.findOne({
                where: { id: idNumber },
            });
        } catch (error) {
            throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
        }
    }

    async delete(id: string): Promise<void> {
        try {
            const idNumber = Number(id);
            await this.userRepository.delete(idNumber);
        } catch (error) {
            throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
        }
    }
}
