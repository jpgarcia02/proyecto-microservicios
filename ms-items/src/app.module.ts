import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ItemsModule } from './items/items.module';
import { AuthModule } from './auth/auth.module';  // ← AGREGAR
import { Item } from './items/entities/item.entity';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),

    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT || '5432', 10),
      username: process.env.DB_USERNAME || 'postgres',
      password: process.env.DB_PASSWORD || 'postgres',
      database: process.env.DB_NAME || 'ms-items',
      entities: [Item],
      synchronize: true, // Solo desarrollo
    }),

    ItemsModule,
    AuthModule,  // ← AGREGAR AQUÍ
  ],
})
export class AppModule {}