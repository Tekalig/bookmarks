import { ForbiddenException, Injectable } from '@nestjs/common';
import { DbService } from 'src/db/db.service';
import { EditUserPayload } from './payload';

@Injectable()
export class UserService {
  constructor(private db: DbService) {}

  async editProfile(userId: number, payload: EditUserPayload) {
    try {
      const user = await this.db.user.update({
        where: { id: userId },
        data: { ...payload },
      });

      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password, ...safeUser } = user;

      return safeUser;
    } catch {
      throw new ForbiddenException('User not found');
    }
  }
}
