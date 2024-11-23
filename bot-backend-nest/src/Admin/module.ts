import { Module } from '@nestjs/common';
import { AdminController } from './controllers';
import { AdminService } from './services';

@Module({
  controllers: [AdminController],
  providers: [AdminService],
})
export class AdminModule {}
