import { IsEmail, IsOptional, IsString } from 'class-validator';

export class EditUserPayload {
  @IsString()
  @IsOptional()
  first_name?: string;

  @IsString()
  @IsOptional()
  last_name?: string;

  @IsEmail()
  @IsOptional()
  email?: string;
}
