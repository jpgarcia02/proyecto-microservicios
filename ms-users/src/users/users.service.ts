import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import * as bcrypt from 'bcrypt';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';


@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
  ){}


  async create(createUserDto: CreateUserDto) {
    const hashPassword = await bcrypt.hash(createUserDto.password,10)
    const newUser ={
      ...createUserDto,
      password: hashPassword
    }

    const save = await this.userRepository.save(newUser)
    const {password, ...noPassword} = save
    
    return noPassword
  }
  async findAll() {
    const users= await this.userRepository.find();
      const usersWithoutPassword = users.map(({ password, ...rest }) => rest);

      return usersWithoutPassword;

    }
  

  async findOne(id: string) {
    const user = await this.userRepository.findOne({where:{id}})
    if(!user){
      throw new NotFoundException(`Usuario con el ID: ${id} no encontrado`)
    }
    const {password,...noPassword}= user
    return noPassword;
  }

  async update(id: string, updateUserDto: UpdateUserDto) {

    const user = await this.userRepository.findOne({where:{id}})
    if(!user){
      throw new NotFoundException(`Usuario con el ID: ${id} no encontrado`)
    }

    const newUser = Object.assign(user, updateUserDto)
    const saveUser = await this.userRepository.save(newUser)
    const {password,...noPassword}= saveUser
    return noPassword;
  }

  async remove(id: string) {

    const user = await this.userRepository.findOne({where:{id}})
    if(!user){
      throw new NotFoundException(`Usuario con el ID: ${id} no encontrado`)
    }

    await this.userRepository.remove(user)
    return `Usuario con el id: #${id} Eliminado`;
  }

  async findByEmail(email:string){
    const user = await this.userRepository.findOne({where:{email}})
    if(!user){
      throw new UnauthorizedException(`Usuario con el email: ${email} no encontrado`)
    }
    return user
  }
}
