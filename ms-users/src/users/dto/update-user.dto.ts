import { PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.dto';
import { IsEmail, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class UpdateUserDto  {

    @IsString()
    @IsOptional()
    name?: string 
    
        @IsEmail()
        @IsOptional()
        email?: string 
    
}
