import { Module } from '@nestjs/common';
import { UserSubscription } from './controllers';
import { UserSubscriptionService } from './services';
// import { DatabaseModule } from 'src/DB/database.module';
import { User, UserSchema } from './schemas/user.schema';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
  ],
  controllers: [UserSubscription],
  providers: [UserSubscriptionService],
  exports: [UserSubscriptionService],
})
export class UserSubscriptionModule {}
