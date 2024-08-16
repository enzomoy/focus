import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Task } from 'src/models/Task';
import { TaskController } from './task.controller';
import { TaskService } from './task.service';
import { User } from 'src/models/User';
import { UserService } from 'src/user/user.service';

@Module({
  imports: [TypeOrmModule.forFeature([Task, User])],
  controllers: [TaskController],
  providers: [TaskService, UserService],
})
export class TaskModule {}
