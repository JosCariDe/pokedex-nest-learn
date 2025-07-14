import axios, { AxiosInstance } from "axios";
import { HttpAdapter } from "../interfaces/http-adaptaer.interface";
import { BadRequestException, Injectable } from "@nestjs/common";

@Injectable()
export class AxiosAdapter implements HttpAdapter {

    private readonly axios: AxiosInstance = axios; 
    
    async get<T>(url: string): Promise<T> {

        try {
            const {data} = await this.axios.get<T>(url);
            return data;
        } catch (error) {
            console.log(`Error en axios Adapter: ${error}`);
            throw new Error(`Error en AXIOS ADAPTER ${error}`);
        }
        
    }

}