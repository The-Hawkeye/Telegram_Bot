import { Module } from '@nestjs/common';
import { databaseProviders } from './database.provider';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [MongooseModule.forRoot(process.env.MONGO_URI)],
  providers: [...databaseProviders],
  exports: [MongooseModule],
})
export class DatabaseModule {}
