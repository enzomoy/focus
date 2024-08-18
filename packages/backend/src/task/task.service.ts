import { NotFoundError, UnauthorizedError } from '@common/errors/CustomError';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Task } from 'src/models/Task';
import { UserService } from 'src/user/user.service';
import { Repository } from 'typeorm';

@Injectable()
export class TaskService {
  constructor(
    @InjectRepository(Task)
    private readonly taskRepository: Repository<Task>,
    private readonly userService: UserService,
  ) {}

  async getTasks(id: number) {
    const tasks = await this.taskRepository.find({
      where: [{ user: { id } }],
    });

    if (tasks.length === 0) {
      return {
        success: true,
        message: 'No tasks found',
      };
    }

    return {
      success: true,
      tasks,
    };
  }

  async createTask(idUser: number, name: string) {
    const user = (await this.userService.getUser(idUser)).user;

    const task = this.taskRepository.create({
      name,
      user,
    });
    await this.taskRepository.save(task);

    return {
      success: true,
      message: 'Task created successfully',
    };
  }

  async updateTaskName(userId: number, taskId: number, name: string) {
    const task = await this.taskRepository.findOne({
      where: [
        {
          id: taskId,
        },
      ],
      relations: ['user'],
    });

    if (!task) {
      throw new NotFoundError('Task not found');
    }

    if (task.user.id !== userId) {
      throw new UnauthorizedError('You are not authorized to update this task');
    }

    task.name = name;
    await this.taskRepository.save(task);

    return {
      success: true,
      message: 'Task updated successfully',
    };
  }

  async updateTaskStatus(userId: number, taskId: number) {
    const task = await this.taskRepository.findOne({
      where: [
        {
          id: taskId,
        },
      ],
      relations: ['user'],
    });

    if (!task) {
      throw new NotFoundError('Task not found');
    }

    if (task.user.id !== userId) {
      throw new UnauthorizedError('You are not authorized to update this task');
    }

    if (task.status === 'pending') {
      task.status = 'completed';
    } else {
      task.status = 'pending';
    }

    await this.taskRepository.save(task);

    return {
      success: true,
      message: 'Task status updated successfully',
    };
  }

  async deleteTask(userId: number, taskId: number) {
    const task = await this.taskRepository.findOne({
      where: [
        {
          id: taskId,
        },
      ],
      relations: ['user'],
    });

    if (!task) {
      return {
        success: false,
        message: 'Task not found',
      };
    }

    if (task.user.id !== userId) {
      return {
        success: false,
        message: 'You are not authorized to delete this task',
      };
    }

    await this.taskRepository.delete(taskId);

    return {
      success: true,
      message: 'Task deleted successfully',
    };
  }
}
