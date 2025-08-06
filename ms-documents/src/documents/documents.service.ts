import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateDocumentDto } from './dto/create-document.dto';
import { UpdateDocumentDto } from './dto/update-document.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Document, DocumentStatus } from './entities/document.entity';
import { Repository } from 'typeorm';
import { Category } from 'src/categories/entities/category.entity';

@Injectable()
export class DocumentsService {
  constructor(
    @InjectRepository(Document) private readonly documentRepository: Repository<Document>,
    @InjectRepository(Category) private readonly categoryRepository: Repository<Category>
  ){}
  
 async create(createDocumentDto: CreateDocumentDto) {
  // 1️⃣ Buscar categoría por ID
  const searchCategory = await this.categoryRepository.findOne({
    where: { id: createDocumentDto.categoryId },
  });

  if (!searchCategory) {
    throw new NotFoundException(
      `Categoria con el ID: ${createDocumentDto.categoryId} no encontrada`,
    );
  }

  // 2️⃣ Remover categoryId y armar documento limpio
  const { categoryId, ...data } = createDocumentDto;
  const newDocument = this.documentRepository.create({
    ...data,
    category: searchCategory,
  });

  // 3️⃣ Guardar en la base de datos
  const savedDocument = await this.documentRepository.save(newDocument);

  // 4️⃣ Retornar el documento creado
  return savedDocument;
}

  async findAll() {
    return await this.documentRepository.find({relations:['category']});
  }

  async findOne(id: string) {

    const searchDocument = await this.documentRepository.findOne({where:{id},relations:['category']});

  if (!searchDocument) {
    throw new NotFoundException(
      `Documento con el ID: ${id} no encontrado`,)
    
    
  }
  return searchDocument;
}

  async update(id: string, updateDocumentDto: UpdateDocumentDto) {
  // 1️⃣ Buscar el documento con su categoría
  const searchDocument = await this.documentRepository.findOne({
    where: { id },
    relations: ['category'],
  });

  if (!searchDocument) {
    throw new NotFoundException(`Documento con el ID: ${id} no encontrado`);
  }

  // 2️⃣ Si viene un categoryId, validar y asignar
  if (updateDocumentDto.categoryId) {
    const searchCategory = await this.categoryRepository.findOne({
      where: { id: updateDocumentDto.categoryId },
    });

    if (!searchCategory) {
      throw new NotFoundException(
        `Categoria con el ID: ${updateDocumentDto.categoryId} no encontrada`,
      );
    }

    searchDocument.category = searchCategory;
  }

  // 3️⃣ Aplicar cambios del DTO (sin categoryId)
  const { categoryId, ...dataToUpdate } = updateDocumentDto;
  Object.assign(searchDocument, dataToUpdate);

  // 4️⃣ Guardar y retornar el documento actualizado
  return await this.documentRepository.save(searchDocument);
}
  async remove(id: string) {
  // 1️⃣ Buscar el documento
  const searchDocument = await this.documentRepository.findOne({ where: { id } });

  if (!searchDocument) {
    throw new NotFoundException(`Documento con el ID: ${id} no encontrado`);
  }

  // 2️⃣ Soft delete: cambiar status a DELETED
  searchDocument.status = DocumentStatus.DELETED;

  // 3️⃣ Guardar el cambio
  await this.documentRepository.save(searchDocument);

  return { message: `Documento con el ID: ${id} eliminado correctamente` };
}

}
