import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DocumentVersion } from './entities/document-version.entity';
import { CreateDocumentVersionDto } from './dto/create-document-version.dto';
import { UpdateDocumentVersionDto } from './dto/update-document-version.dto';
import { Document } from '../documents/entities/document.entity';

@Injectable()
export class DocumentVersionsService {
  constructor(
    @InjectRepository(DocumentVersion)
    private readonly versionRepository: Repository<DocumentVersion>,

    @InjectRepository(Document)
    private readonly documentRepository: Repository<Document>,
  ) {}

  // 1️⃣ Crear nueva versión
  async create(createDocumentVersionDto: CreateDocumentVersionDto) {
    const { documentId, ...data } = createDocumentVersionDto;

    // Validar que el documento exista
    const searchDocument = await this.documentRepository.findOne({ where: { id: documentId } });
    if (!searchDocument) {
      throw new NotFoundException(`Documento con ID ${documentId} no encontrado`);
    }

    // Crear objeto versión
    const newVersion = this.versionRepository.create({
      ...data,
      document: searchDocument,
    });

    return await this.versionRepository.save(newVersion);
  }

  // 2️⃣ Listar todas las versiones
  async findAll() {
    return await this.versionRepository.find({
      relations: ['document'],
    });
  }

  // 3️⃣ Buscar una versión por ID
  async findOne(id: string) {
    const searchVersion = await this.versionRepository.findOne({
      where: { id },
      relations: ['document'],
    });

    if (!searchVersion) {
      throw new NotFoundException(`Versión con ID ${id} no encontrada`);
    }

    return searchVersion;
  }

  // 4️⃣ Actualizar versión (opcional)
  async update(id: string, updateDocumentVersionDto: UpdateDocumentVersionDto) {
    const searchVersion = await this.versionRepository.findOne({ where: { id } });

    if (!searchVersion) {
      throw new NotFoundException(`Versión con ID ${id} no encontrada`);
    }

    Object.assign(searchVersion, updateDocumentVersionDto);
    return await this.versionRepository.save(searchVersion);
  }

  // 5️⃣ Eliminar versión
  async remove(id: string) {
    const searchVersion = await this.versionRepository.findOne({ where: { id } });

    if (!searchVersion) {
      throw new NotFoundException(`Versión con ID ${id} no encontrada`);
    }

    await this.versionRepository.remove(searchVersion);

    return { message: `Versión con ID ${id} eliminada correctamente` };
  }

  async uploadVersion(documentId: string, file: Express.Multer.File) {
  // 1️⃣ Verificar que el documento existe
  const document = await this.documentRepository.findOne({ where: { id: documentId } });
  if (!document) {
    throw new NotFoundException(`Documento con ID ${documentId} no encontrado`);
  }

  // 2️⃣ Contar cuántas versiones tiene este documento para asignar el número de versión
  const versionCount = await this.versionRepository.count({
    where: { document: { id: documentId } },
  });
  const versionNumber = versionCount + 1;

  // 3️⃣ Crear objeto de la nueva versión
  const newVersion = this.versionRepository.create({
    document,
    versionNumber,
    fileName: file.originalname,
    filePath: file.path,
    mimeType: file.mimetype,
    size: file.size,
    changeDescription: `Versión ${versionNumber} subida`,
  });

  // 4️⃣ Guardar en base de datos
  return await this.versionRepository.save(newVersion);
}
}
