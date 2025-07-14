import { Controller, Get, Post, Body, Patch, Param, Delete, HttpCode, HttpStatus, Query } from '@nestjs/common';
import { PokemonService } from './pokemon.service';
import { CreatePokemonDto } from './dto/create-pokemon.dto';
import { UpdatePokemonDto } from './dto/update-pokemon.dto';
import { PaserMongoIdPipe } from 'src/common/pipes/paser-mongo-id/paser-mongo-id.pipe';
import { PaginationDto } from 'src/common/dto/pagination.dto';

@Controller('pokemon')
export class PokemonController {
  constructor(private readonly pokemonService: PokemonService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)  // SE puede colar el CODE como 200 201, etc, pero mejor usar la clase ENUM
  create(@Body() createPokemonDto: CreatePokemonDto) { // Nos facilita todos los CODE de RESPONSE
    return this.pokemonService.create(createPokemonDto);
  }

  @Get('')
  findAll(@Query() paginationDto: PaginationDto) {

    console.log({paginationDto});
    return this.pokemonService.findAll(paginationDto);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.pokemonService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updatePokemonDto: UpdatePokemonDto) {
    return this.pokemonService.update(id, updatePokemonDto);
  }

  @Delete(':id')
  remove(@Param('id', PaserMongoIdPipe) id: string) {
    return this.pokemonService.remove(id);
  }
}
