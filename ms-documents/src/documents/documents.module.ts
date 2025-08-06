import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Document } from './entities/document.entity';
import { DocumentsService } from './documents.service';
import { DocumentsController } from './documents.controller';
import { Category } from 'src/categories/entities/category.entity';
import { DocumentVersion } from 'src/document-versions/entities/document-version.entity';

@Module({
  imports: [TypeOrmModule.forFeature([DocumentVersion,Category,Document])],
  controllers: [DocumentsController],
  providers: [DocumentsService],
  exports: [DocumentsService],
})
export class DocumentsModule {}
