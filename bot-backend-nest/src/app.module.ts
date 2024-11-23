import { Module } from '@nestjs/common';
import { UserSubscriptionModule } from './UserSubscription';
import { AdminModule } from './Admin';
import { MongooseModule } from '@nestjs/mongoose';
import { config } from 'dotenv';
import { TelegramBotService } from './bot';
import { AdminService } from './Admin/services';
// import { UserSubscriptionService } from './UserSubscription/services';
import { AdminController } from './Admin/controllers';
import { AppService } from './app.service';
import { AppController } from './app.controller';
// import { UserSubscription } from './UserSubscription/controllers';

config();

@Module({
  imports: [
    AdminModule,
    UserSubscriptionModule,
    MongooseModule.forRootAsync({
      useFactory: () => ({
        uri: process.env.MONGO_URI,
      }),
    }),
    UserSubscriptionModule,
  ],
  controllers: [AppController, AdminController],
  providers: [AppService, TelegramBotService, AdminService],
})
export class AppModule {
  constructor() {
    console.log('Hell yeah');
  }
}
