import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DocumentVersion } from './entities/document-version.entity';
import { DocumentVersionsService } from './document-versions.service';
import { DocumentVersionsController } from './document-versions.controller';
import { Category } from 'src/categories/entities/category.entity';
import { Document } from 'src/documents/entities/document.entity';

@Module({
  imports: [TypeOrmModule.forFeature([DocumentVersion,Category,Document])],
  controllers: [DocumentVersionsController],
  providers: [DocumentVersionsService],
  exports: [DocumentVersionsService],
})
export class DocumentVersionsModule {}
