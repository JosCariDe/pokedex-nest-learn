import { BadRequestException, Injectable } from '@nestjs/common';
import axios, { AxiosInstance } from 'axios';
import { PokeResponse } from './interfaces/poke-response.interface';
import { InjectModel } from '@nestjs/mongoose';
import { Pokemon } from 'src/pokemon/entities/pokemon.entity';
import { Model } from 'mongoose';


@Injectable()
export class SeedService {

  private readonly axios: AxiosInstance = axios; 

  constructor(

    @InjectModel(Pokemon.name)
    private readonly pokemonModel: Model<Pokemon>

  ){}


  
  async exetuceSeed() {

    const {data} = await this.axios.get<PokeResponse>('https://pokeapi.co/api/v2/pokemon?limit=10');
    //console.log(fetch);

    data.results.forEach(async ({name, url}) => {
      const segment = url.split('/');
      console.log(segment);
      const no: number = +segment[segment.length - 2];
      console.log({name, no});

      try {
        await this.pokemonModel.create({name, no});
      } catch (error) {
        console.log(error);
        //throw new BadRequestException(`Error al poblar el DB`);
      }

    })

    return data.results; 

  }

  
}
