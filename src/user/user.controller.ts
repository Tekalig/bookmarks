import { Body, Controller, Get, Patch, UseGuards } from '@nestjs/common';
import { User } from 'generated/prisma';
import { GetUser } from 'src/auth/decorator';
import { JwtGuard } from 'src/auth/guard';
import { EditUserPayload } from './payload';
import { UserService } from './user.service';

@UseGuards(JwtGuard)
@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  @Get('me')
  getMe(@GetUser() user: User) {
    return user;
  }

  @Patch('update-profile')
  editProfile(@GetUser('id') userId: number, @Body() payload: EditUserPayload) {
    return this.userService.editProfile(userId, payload);
  }
}
