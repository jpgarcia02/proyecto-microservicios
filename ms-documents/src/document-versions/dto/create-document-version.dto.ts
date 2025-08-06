import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateDocumentVersionDto {
  @IsString()
  @IsNotEmpty()
  documentId: string;

  @IsNumber()
  @IsNotEmpty()
  versionNumber: number;

  @IsString()
  @IsNotEmpty()
  fileName: string;

  @IsString()
  @IsNotEmpty()
  filePath: string;

  @IsString()
  @IsNotEmpty()
  mimeType: string;

  @IsNumber()
  @IsNotEmpty()
  size: number;

  @IsOptional()
  @IsString()
  changeDescription?: string;
}
