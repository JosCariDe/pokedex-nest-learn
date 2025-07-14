import { BadRequestException, Injectable } from '@nestjs/common';
import axios, { AxiosInstance } from 'axios';
import { PokeResponse } from './interfaces/poke-response.interface';
import { InjectModel } from '@nestjs/mongoose';
import { Pokemon } from 'src/pokemon/entities/pokemon.entity';
import { Model } from 'mongoose';
import { HttpAdapter } from 'src/common/interfaces/http-adaptaer.interface';
import { AxiosAdapter } from 'src/common/adapters/axios.adapter';


@Injectable()
export class SeedService {


  constructor(

    @InjectModel(Pokemon.name)
    private readonly pokemonModel: Model<Pokemon>,

    private readonly http: AxiosAdapter,

  ){}


  /* METODO 1
  async exetuceSeed() {

    await this.pokemonModel.deleteMany({}); //ELIMINAR TODOS LOS REGISTROS DEL DB CUIDADO!!!!!

    const {data} = await this.axios.get<PokeResponse>('https://pokeapi.co/api/v2/pokemon?limit=10');
    //console.log(fetch);

    const insertPromiseArray: Promise<any>[] = [];

    data.results.forEach( ({name, url}) => {
      const segment = url.split('/');
      console.log(segment);
      const no: number = +segment[segment.length - 2];
      console.log({name, no});

      insertPromiseArray.push(
        this.pokemonModel.create({name, no})
      );
    })

    await Promise.all( insertPromiseArray );

    return data.results; 

  } */

    // MTEOTODO 2
  async exetuceSeed() {

    await this.pokemonModel.deleteMany({}); //ELIMINAR TODOS LOS REGISTROS DEL DB CUIDADO!!!!!

    const data = await this.http.get<PokeResponse>('https://pokeapi.co/api/v2/pokemon?limit=650');
    //console.log(fetch);

    const pokemonToInsert: {name: string, no: number}[] = [];

    data.results.forEach( ({name, url}) => {
      const segment = url.split('/');
      //console.log(segment);
      const no: number = +segment[segment.length - 2];
      //console.log({name, no});

      pokemonToInsert.push({name, no});
    })

    await this.pokemonModel.insertMany(pokemonToInsert); //AHora solo se hace una sola inserción

    return 'Seed ejecutado'; 

  }

  
}
