import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateItemDto } from './dto/create-item.dto';
import { UpdateItemDto } from './dto/update-item.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Item } from './entities/item.entity';
import { Repository } from 'typeorm';

@Injectable()
export class ItemsService {
  constructor(
    @InjectRepository(Item) private readonly itemRepository : Repository<Item>,
  ){}
  
  async create(createItemDto: CreateItemDto, userId: string) {
  // 1️⃣ Crear la instancia del item
  const newItem = this.itemRepository.create({
    ...createItemDto,
    userId, // Asignamos el usuario dueño del item
  });

  // 2️⃣ Guardar en la base de datos
  const savedItem = await this.itemRepository.save(newItem);

  // 3️⃣ Retornar el item creado (sin tocar nada sensible)
  return savedItem;
}


  findAll(userId: string) {
    return this.itemRepository.find({where:{userId}})
  }

  async findOne(id: string,userId:string) {
    const searchItem = await this.itemRepository.findOne({where:{id,userId}})
    if(!searchItem){
      throw new NotFoundException(`Itemno encontrado`)
    }
    return searchItem
  }

  async update(id: string, updateItemDto: UpdateItemDto,userId:string) {
    const searchItem = await this.itemRepository.findOne({where:{id,userId}})
    if(!searchItem){
      throw new NotFoundException(`Item no encontrado`)
    }

    const newItem = Object.assign(searchItem,updateItemDto)
    await this.itemRepository.save(newItem)
    return newItem;
  }

  async remove(id: string, userId: string) {
    const searchItem = await this.itemRepository.findOne({where:{id,userId}})
    if(!searchItem){
      throw new NotFoundException(`Item no encontrado`)
    }
    await this.itemRepository.remove(searchItem)
    return `Item eliminado exitosamente`;
  }
}
