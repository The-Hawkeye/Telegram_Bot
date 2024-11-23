/* eslint-disable prettier/prettier */
import { Injectable, Logger } from '@nestjs/common';
import * as TelegramBot from 'node-telegram-bot-api';
import fetch from 'node-fetch';
import * as cron from 'node-cron';
import { config } from 'dotenv';
import { AdminService } from './Admin/services';
import { UserSubscriptionService } from './UserSubscription/services';
config();

const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const CITY = process.env.CITY;

if (!TELEGRAM_BOT_TOKEN || !CITY) {
  throw new Error('Missing required environment variables: TELEGRAM_BOT_TOKEN or CITY');
}

interface WeatherResponse {
  weather: {
    description: string;
  }[];
  main: {
    temp: number;
  };
}

@Injectable()
export class TelegramBotService {
  private bot: TelegramBot;
  private subscribedUsers: Set<number> = new Set<number>();

  constructor(
    private readonly adminService: AdminService,
    private readonly userService: UserSubscriptionService,
  ) {
    this.bot = new TelegramBot(TELEGRAM_BOT_TOKEN, { polling: true });

    this.loadSubscribedUsers();

    this.registerCommands();

    cron.schedule('* * * * *', () => {
      console.log('sending update');

      this.sendWeatherUpdatesToAll();
    });
  }

  private registerCommands() {
    // console.log('hello');
// console.log(this.bot, "Actual bot");
    this.bot.onText(/\/start/, async (msg) => {
      // console.log('Hello');
      // console.log(msg,"Complete Message")
      const chatId = msg.chat.id;
      const first_name = msg.from.first_name;

      this.bot.sendMessage(
        chatId,
        `Hi ${first_name}, welcome to the weather bot, you can subscribe by using the /subscribe command, and unsubscribe using /unsubscribe command}`,
      );
    });

    
    // this.bot.onText(/\/subscribe/, async (msg) => {
    //   console.log(msg);

    //   const chatId = msg.chat.id;
    //   const userId = msg.from.id;
    //   const username = msg.from.first_name;

    //   const existingUser = await this.userService.getUserByChatId(chatId);
    //   console.log(existingUser);

    //   if (existingUser) {
    //     this.bot.sendMessage(chatId, 'You are already registered.');
    //   } else {
    //     const user = await this.userService.createUser(userId, username);
    //     if (user) {
    //       this.bot.sendMessage(chatId, 'You have been registered.');
    //       this.subscribedUsers.add(chatId);
    //       this.sendWeatherUpdate(chatId);
    //     } else {
    //       this.bot.sendMessage(
    //         chatId,
    //         'Registration failed. Please try again.',
    //       );
    //     }
    //   }
    // });



    this.bot.onText(/\/subscribe/, async (msg) => {
      console.log(msg);
    
      const chatId = msg.chat.id;
      const userId = msg.from.id;
      const username = msg.from.first_name;
    
      const existingUser = await this.userService.getUserByChatId(chatId);
      console.log(existingUser);
    
      if (existingUser) {
        this.bot.sendMessage(chatId, 'You are already registered.');
      } else {
        const user = await this.userService.createUser(userId, username);
        if (user) {
          this.bot.sendMessage(chatId, 'You have been registered.');
          this.subscribedUsers.add(chatId);

          this.bot.sendMessage(chatId, 'Please enter the city for which you want updates.');

          this.bot.once('message', async (responseMsg) => {
            const city = responseMsg.text;
  
            const updatedUser = await this.userService.updateUserCity(userId, city);
    
            if (updatedUser) {
              this.bot.sendMessage(chatId, `Thank you! You will now receive updates for ${city}.`);
              this.sendWeatherUpdate(chatId);
            } else {
              this.bot.sendMessage(chatId, 'Failed to save your city. Please try again.');
            }
          });
        } else {
          this.bot.sendMessage(chatId, 'Registration failed. Please try again.');
        }
      }
    });

    

    this.bot.onText(/\/unsubscribe/, async (msg) => {
      const chatId = msg.chat.id;

      const existingUser = await this.userService.getUserByChatId(chatId);
      if (existingUser) {
        const deletedUser = await this.userService.deleteUser(chatId);
        if (deletedUser) {
          this.subscribedUsers.delete(chatId);
          this.bot.sendMessage(chatId, 'You have been unregistered.');
        } else {
          this.bot.sendMessage(
            chatId,
            'Unregistration failed. Please try again.',
          );
        }
      } else {
        this.bot.sendMessage(chatId, 'You are not registered.');
      }
    });

    // Listen for any kind of message. There are different kinds of
// messages.
// this.bot.on('message', (msg) => {
//   const chatId = msg.chat.id;


//   this.bot.sendMessage(chatId, 'Received your message');
// });
  }

  // private async sendWeatherUpdate(chatId: number) {
  //   const apiKey = this.adminService.getApiKey();
  //   console.log(apiKey);

  //   try {
  //     const response = await fetch(
  //       `https://api.openweathermap.org/data/2.5/weather?q=${CITY}&appid=${apiKey}`,
  //     );

  //     if (!response.ok) {
  //       Logger.error('Failed to fetch weather data');
  //       return;
  //     }

  //     const data: WeatherResponse = (await response.json()) as WeatherResponse;

  //     const weatherDescription = data.weather[0]?.description;
  //     const temperature = (data.main?.temp - 273.15)?.toFixed(2); // Convert to Celsius

  //     const message = `Weather in ${CITY}:\n${weatherDescription}\nTemperature: ${temperature}°C`;

  //     this.bot.sendMessage(chatId, message);
  //   } catch (error) {
  //     Logger.error('Error fetching weather data', error);
  //   }
  // }

  // private async sendWeatherUpdatesToAll() {
  //   for (const chatId of this.subscribedUsers) {
  //     this.sendWeatherUpdate(chatId);
  //   }
  // }



  private async sendWeatherUpdate(chatId: number, city?: string) {
    const apiKey = this.adminService.getApiKey();
    const targetCity = city || 'Delhi';

  
    try {
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(targetCity)}&appid=${apiKey}`,
      );
  
      if (!response.ok) {
        Logger.error(`Failed to fetch weather data for ${targetCity}`);
        this.bot.sendMessage(chatId, `Could not fetch weather data for ${targetCity}. Please try again later.`);
        return;
      }
  
      const data: WeatherResponse = (await response.json()) as WeatherResponse;
  
      const weatherDescription = data.weather[0]?.description || 'N/A';
      const temperature = (data.main?.temp - 273.15)?.toFixed(2);
  
      const message = `Weather in ${targetCity}:\n${weatherDescription}\nTemperature: ${temperature}°C`;
  
      this.bot.sendMessage(chatId, message);
    } catch (error) {
      Logger.error('Error fetching weather data:', error);
      this.bot.sendMessage(chatId, 'An error occurred while fetching weather data. Please try again later.');
    }
  }

  private async sendWeatherUpdatesToAll() {
    try {
      const users = await this.userService.getAllUsersWithCities();
  
      if (!users || users.length === 0) {
        Logger.warn('No users found for weather updates.');
        return;
      }
  
      for (const user of users) {
        const { chatId, city } = user;
  
        const targetCity = city || 'Delhi';
  
        await this.sendWeatherUpdate(chatId, targetCity);
      }
    } catch (error) {
      Logger.error('Error sending weather updates to all users:', error);
    }
  }

  
  private async loadSubscribedUsers() {
    const users = await this.userService.getUsers();
    users.forEach((user) => {
      this.subscribedUsers.add(user.chatId);
    });
  }


}
