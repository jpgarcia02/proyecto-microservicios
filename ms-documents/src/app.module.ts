import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DocumentsModule } from './documents/documents.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DocumentVersionsModule } from './document-versions/document-versions.module';
import { CategoriesModule } from './categories/categories.module';
import { ConfigModule } from '@nestjs/config';
import { MulterModule } from '@nestjs/platform-express';
import { extname } from 'path';
import { diskStorage } from 'multer';

@Module({
  imports: [DocumentsModule,
    ConfigModule.forRoot({
  isGlobal: true,
}),
    TypeOrmModule.forRoot({
  type: 'postgres',
  host: process.env.DB_HOST,
  port: +process.env.DB_PORT!,
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  autoLoadEntities: true,
  synchronize: true,
}),
 
    MulterModule.register({
      storage: diskStorage({
        destination: './uploads', // Carpeta donde guardar los archivos
        filename: (req, file, callback) => {
          const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
          callback(null, uniqueSuffix + extname(file.originalname)); // Ej: 17334818-balance.pdf
        },
      }),}),
    DocumentVersionsModule,
    CategoriesModule

  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
