import { Controller, Get, Post, Body, Patch, Param, Delete, UploadedFile, UseInterceptors } from '@nestjs/common';
import { DocumentVersionsService } from './document-versions.service';
import { CreateDocumentVersionDto } from './dto/create-document-version.dto';
import { UpdateDocumentVersionDto } from './dto/update-document-version.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';

@Controller('document-versions')
export class DocumentVersionsController {
  constructor(private readonly documentVersionsService: DocumentVersionsService) {}

  @Post()
  create(@Body() createDocumentVersionDto: CreateDocumentVersionDto) {
    return this.documentVersionsService.create(createDocumentVersionDto);
  }

  @Get()
  findAll() {
    return this.documentVersionsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.documentVersionsService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateDocumentVersionDto: UpdateDocumentVersionDto) {
    return this.documentVersionsService.update(id, updateDocumentVersionDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.documentVersionsService.remove(id);
  }

  
  @Post('upload/:documentId')
  @UseInterceptors(FileInterceptor('file', {
    storage: diskStorage({
      destination: './uploads', // Carpeta donde se guardan los archivos
      filename: (req, file, callback) => {
        // Generamos un nombre único: id + timestamp + extensión
        const uniqueName = `${req.params.documentId}-${Date.now()}${extname(file.originalname)}`;
        callback(null, uniqueName);
      },
    }),
  }))
  async uploadVersion(
    @Param('documentId') documentId: string,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.documentVersionsService.uploadVersion(documentId, file);
  }


}
