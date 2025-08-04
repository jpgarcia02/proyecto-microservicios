import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  UseGuards,
  Req,
} from '@nestjs/common';
import { ItemsService } from './items.service';
import { CreateItemDto } from './dto/create-item.dto';
import { UpdateItemDto } from './dto/update-item.dto';
import { AuthGuard } from '@nestjs/passport';

@UseGuards(AuthGuard('jwt'))
@Controller('items')
export class ItemsController {
  constructor(private readonly itemsService: ItemsService) {}

  // Crear un nuevo item
  @Post()
  create(@Body() createItemDto: CreateItemDto, @Req() req: any) {
    const userId = req.user.sub; // viene del payload del JWT
    return this.itemsService.create(createItemDto, userId);
  }

  // Obtener todos los items del usuario autenticado
  @Get()
  findAll(@Req() req: any) {
    const userId = req.user.sub;
    return this.itemsService.findAll(userId);
  }

  // Obtener un item por ID
  @Get(':id')
  findOne(@Param('id') id: string, @Req() req: any) {
    const userId = req.user.sub;
    return this.itemsService.findOne(id, userId);
  }

  // Actualizar un item
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateItemDto: UpdateItemDto,
    @Req() req: any,
  ) {
    const userId = req.user.sub;
    return this.itemsService.update(id, updateItemDto, userId);
  }

  // Eliminar un item
  @Delete(':id')
  remove(@Param('id') id: string, @Req() req: any) {
    const userId = req.user.sub;
    return this.itemsService.remove(id, userId);
  }
}
