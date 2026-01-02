import { IsString } from 'class-validator';

export class DeleteImageDto {
  @IsString()
  public_id: string;
}