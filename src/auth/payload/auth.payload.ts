import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class Payload {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  password: string;
}
