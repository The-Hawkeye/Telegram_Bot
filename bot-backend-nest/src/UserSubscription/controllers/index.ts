import { Controller, Delete, Get, Param } from '@nestjs/common';
import { UserSubscriptionService } from '../services';
import { User } from '../schemas/user.schema';

@Controller('users')
export class UserSubscription {
  constructor(private readonly userService: UserSubscriptionService) {}

  @Get()
  async getAllUsers(): Promise<User[]> {
    return this.userService.getUsers();
  }

  @Delete(':chatId')
  async deleteUser(@Param('chatId') chatId: number) {
    const deletedUser = await this.userService.deleteUser(chatId);
    if (deletedUser) {
      return { message: 'User deleted successfully' };
    } else {
      //   throw new NotFoundException('User not found');
    }
  }
}
