/* eslint-disable prettier/prettier */
import { ApiProperty } from '@nestjs/swagger';

export class UpdatePostDto {
  @ApiProperty()
  title: string;
  @ApiProperty()
  description: string;
  @ApiProperty({ type: 'string', format: 'binary' })
  thumpnail: Express.Multer.File;
  status: number;
}
