import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Category } from './entities/category.entity';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
  ) {}

  // 1️⃣ Crear categoría
  async create(createCategoryDto: CreateCategoryDto) {
    const newCategory = this.categoryRepository.create(createCategoryDto);
    return await this.categoryRepository.save(newCategory);
  }

  // 2️⃣ Listar todas las categorías
  async findAll() {
    return await this.categoryRepository.find({
      relations: ['documents'],
    });
  }

  // 3️⃣ Buscar categoría por ID
  async findOne(id: string) {
    const searchCategory = await this.categoryRepository.findOne({
      where: { id },
      relations: ['documents'],
    });

    if (!searchCategory) {
      throw new NotFoundException(`Categoría con ID: ${id} no encontrada`);
    }

    return searchCategory;
  }

  // 4️⃣ Actualizar categoría
  async update(id: string, updateCategoryDto: UpdateCategoryDto) {
    const searchCategory = await this.categoryRepository.findOne({ where: { id } });

    if (!searchCategory) {
      throw new NotFoundException(`Categoría con ID: ${id} no encontrada`);
    }

    Object.assign(searchCategory, updateCategoryDto);
    return await this.categoryRepository.save(searchCategory);
  }

  // 5️⃣ Eliminar categoría
  async remove(id: string) {
    const searchCategory = await this.categoryRepository.findOne({ where: { id } });

    if (!searchCategory) {
      throw new NotFoundException(`Categoría con ID: ${id} no encontrada`);
    }

    await this.categoryRepository.remove(searchCategory);

    return { message: `Categoría con ID: ${id} eliminada correctamente` };
  }
}
