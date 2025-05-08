import { IsNotEmpty, IsOptional, IsString, IsUrl } from 'class-validator';

export class CreateBookmarkPayload {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsUrl()
  @IsNotEmpty()
  url: string;
}
