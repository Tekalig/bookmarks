import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class AuthPayload {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  password: string;
}
