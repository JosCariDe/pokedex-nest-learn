import { ArgumentMetadata, BadRequestException, Injectable, PipeTransform } from '@nestjs/common';
import { isValidObjectId } from 'mongoose';

@Injectable()
export class PaserMongoIdPipe implements PipeTransform {
  transform(value: string, metadata: ArgumentMetadata) {
    //console.log({value, metadata});

    if ( !isValidObjectId(value) ) {
      throw new BadRequestException(`El parametro debe ser un monngo ID, ${value} no es un mongo ID`);
    }

    return value;
  }
}
