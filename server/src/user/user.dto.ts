import { IsObjectId } from 'src/IsValidObjectId';

export class UserIdDto {
  @IsObjectId()
  userId: string;
}
