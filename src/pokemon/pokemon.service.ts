import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException, HttpCode } from '@nestjs/common';
import { CreatePokemonDto } from './dto/create-pokemon.dto';
import { UpdatePokemonDto } from './dto/update-pokemon.dto';
import { isValidObjectId, Model } from 'mongoose';
import { Pokemon } from './entities/pokemon.entity';
import { InjectModel} from '@nestjs/mongoose';
import { PaginationDto } from '../common/dto/pagination.dto';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class PokemonService {

  private defaultLimit: number;

  constructor(
    @InjectModel(Pokemon.name)
    private readonly pokemonModel: Model<Pokemon>,
    private readonly configService: ConfigService
  ) {

    console.log(process.env.DEFAULT_LIMIT);
    //TODO getOrThrow para evitar que de alguna manera sea nulo, aunque nunca lo será, cosas raras de ts
    this.defaultLimit = configService.getOrThrow<number>('defaultLimit'); 
  }

  async create(createPokemonDto: CreatePokemonDto) {
    createPokemonDto.name = createPokemonDto.name.toLocaleLowerCase();

    try {
      const pokemon = await this.pokemonModel.create(createPokemonDto);
      return pokemon;
    } catch (error) {
      this.handleExceptions(error);
    }

  }

  /*
  async createAll(listaPokemonesDto: CreatePokemonDto[]) {

    try {
      listaPokemonesDto.forEach((pokemon) => {
        this.pokemonModel.create(pokemon);
      })

      return {
        data: listaPokemonesDto
      }
    } catch (error) {
    }
  } */

  findAll(paginationDto: PaginationDto) {
    const { limit = this.defaultLimit, offset = 0 } = paginationDto;

    return this.pokemonModel.find()
      .limit(limit)
      .skip(offset)
      .sort({
        no: 1 // ORGANIZA POR LA COLUMNA NO DE MANERA ASCENDENTE
      })
      .select('-__v'); //ELIMINA LA COMLUMNA __v
  }

  async findOne(id: string) {
    let pokemon: Pokemon | null;

    //Buscar pokemon por el parametro "no"
    if (!isNaN(+id)) {
      pokemon = await this.pokemonModel.findOne({ no: id });
    } else if (isValidObjectId(id)) /* BUscar por ID MOngo*/ {
      pokemon = await this.pokemonModel.findById(id)
    } else  /* BUscar por name*/ {
      pokemon = await this.pokemonModel.findOne({ name: id.toLocaleLowerCase().trim() })
    }

    // Evaluar si se encontró o no
    if (pokemon == null) throw new NotFoundException(`El pokemon con el id "${id}" no fue encontrado en el DB`);

    return pokemon;
  }

  async update(id: string, updatePokemonDto: UpdatePokemonDto) {

    try {
      const pokemon: Pokemon = await this.findOne(id);

      if (updatePokemonDto.name) updatePokemonDto.name = updatePokemonDto.name.toLocaleLowerCase();

      await pokemon.updateOne(updatePokemonDto);

      return { ...pokemon.toJSON(), ...updatePokemonDto };
    } catch (e) {
      this.handleExceptions(e);
    }

  }

  async remove(id: string) {


    try {

      const { deletedCount, acknowledged } = await this.pokemonModel.deleteOne({ _id: id });

      if (deletedCount === 0) throw new BadRequestException(`Pokemon whit id "${id}" not found`);

      return {
        message: `Pokemon con el id ${id} eliminado correctamente del DB`
      }

    } catch (error) {

      console.log(error);

      this.handleExceptions(error);

    }


  }

  private handleExceptions(error: any) {
    if (error.code === 11000)
      throw new BadRequestException(`Pokemon exist in db ${JSON.stringify(error.keyValue)}`);
    console.log(error);
    throw new InternalServerErrorException(`Can't create pokemon - CHECK SERVER LOGS`);
  }
}
