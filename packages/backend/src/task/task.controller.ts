import { TaskSchem, taskSchema } from '@common/validations/task-schema';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Request,
  UseGuards,
  UsePipes,
} from '@nestjs/common';
import { AuthGuard } from 'src/middlewares/auth.guard';
import { ZodValidationPipe } from 'src/pipes/zod.pipe';
import { TaskService } from './task.service';

@UseGuards(AuthGuard)
@Controller('task')
export class TaskController {
  constructor(private readonly taskService: TaskService) {}

  @Get()
  getTasks(@Request() req) {
    const id = req.user.id;
    return this.taskService.getTasks(id);
  }

  @Post()
  @UsePipes(new ZodValidationPipe(taskSchema))
  createTask(@Request() req, @Body() body: TaskSchem) {
    const id = req.user.id;
    return this.taskService.createTask(id, body.name);
  }

  @Patch('name/:id')
  @UsePipes(new ZodValidationPipe(taskSchema))
  updateTaskName(@Request() req, @Body() body: TaskSchem) {
    const userId = req.user.id;
    const id = Number(req.params.id);
    return this.taskService.updateTaskName(userId, id, body.name);
  }

  @Patch('status/:id')
  updateTaskStatus(@Request() req, @Param('id') id: number) {
    const userId = req.user.id;
    return this.taskService.updateTaskStatus(userId, id);
  }

  @Delete(':id')
  deleteTask(@Request() req, @Param('id') id: number) {
    const userId = req.user.id;
    return this.taskService.deleteTask(userId, id);
  }
}
