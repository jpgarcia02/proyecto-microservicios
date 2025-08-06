import { IsEmpty, IsEnum, IsNotEmpty, IsOptional, IsString } from "class-validator";
import { DocumentStatus } from "../entities/document.entity";

export class CreateDocumentDto {


    @IsString()
    @IsNotEmpty()
    name: string 

    @IsString()
    @IsOptional()
    description: string 

    @IsString()
    @IsNotEmpty()
    categoryId: string 

    @IsEnum(DocumentStatus)
    @IsOptional()
    status: DocumentStatus


}
