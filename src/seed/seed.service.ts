import { Injectable } from '@nestjs/common';
import axios, { AxiosInstance } from 'axios';
import { PokeResponse } from './interfaces/poke-response.interface';


@Injectable()
export class SeedService {

  private readonly axios: AxiosInstance = axios; 

  async exetuceSeed() {

    const {data} = await axios.get<PokeResponse>('https://pokeapi.co/api/v2/pokemon?limit=5');
    //console.log(fetch);

    data.results.forEach(({name, url}) => {
      const segment = url.split('/');
      console.log(segment);
      const no: number = +segment[segment.length - 2];
      console.log(no);
    })

    return data.results; 

  }

  
}
