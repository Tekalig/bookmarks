import { IsOptional, IsString, IsUrl } from 'class-validator';

export class EditBookmarkPayload {
  @IsString()
  @IsOptional()
  title?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsUrl()
  @IsOptional()
  url?: string;
}
