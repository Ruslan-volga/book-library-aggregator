import { IsString, IsNotEmpty, IsNumber } from 'class-validator';

export class SendMessageDto {
  @IsNumber()
  supportRequest: number;

  @IsString()
  @IsNotEmpty()
  text: string;
}
