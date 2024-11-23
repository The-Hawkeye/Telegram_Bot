// user-subscription.service.ts
import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { User } from '../schemas/user.schema';

@Injectable()
export class UserSubscriptionService {
  async getAllUsersWithCities(): Promise<
    { chatId: number; city: string | null }[]
  > {
    try {
      const users = await this.userModel
        .find({}, { chatId: 1, city: 1, _id: 0 })
        .exec();

      if (!users || users.length === 0) {
        return [];
      }

      return users.map((user) => ({
        chatId: user.chatId,
        city: user.city || null,
      }));
    } catch (error) {
      throw error;
    }
  }

  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  async createUser(chatId: number, username: string): Promise<User> {
    const user = new this.userModel({ chatId, username });
    return user.save();
  }

  async updateUserCity(chatId: number, city: string): Promise<User | null> {
    try {
      console.log(chatId, city, 'Updating user city...');

      const updatedUser = await this.userModel
        .findOneAndUpdate(
          { chatId },
          { $set: { city } },
          { new: true, useFindAndModify: false },
        )
        .exec();

      if (!updatedUser) {
        console.log(`User with chatId ${chatId} not found.`);
        return null;
      }

      console.log('Updated user:', updatedUser);
      return updatedUser;
    } catch (error) {
      console.error('Error updating user city:', error);
      throw error;
    }
  }

  async deleteUser(chatId: number): Promise<User | null> {
    return this.userModel.findOneAndDelete({ chatId }).exec();
  }

  async getUsers(): Promise<User[]> {
    return this.userModel.find().exec();
  }

  async getUserByChatId(chatId: number): Promise<User | null> {
    return this.userModel.findOne({ chatId }).exec();
  }
}
