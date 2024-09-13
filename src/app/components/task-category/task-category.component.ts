import { Component, EventEmitter, Input, Output } from '@angular/core';
import { TaskCategory } from '../../interfaces/task-category';
import { TaskComponent } from '../task/task.component';
import { KanbanService } from '../../services/kanban.service';
import {
  CdkDragDrop,
  CdkDropList,
  DragDropModule,
  moveItemInArray,
  transferArrayItem,
} from '@angular/cdk/drag-drop';
import { Task } from '../../interfaces/task';
import { ModalType } from '../../enums/modal-type';

@Component({
  selector: 'app-task-category',
  standalone: true,
  imports: [TaskComponent, DragDropModule, CdkDropList],
  templateUrl: './task-category.component.html',
  styleUrl: './task-category.component.css',
})
export class TaskCategoryComponent {
  @Input() properties: TaskCategory = {
    id: '',
    name: '',
    color: '',
    tasks: [],
  };
  constructor(private kanbanService: KanbanService) {}

  addTask() {
    this.kanbanService.activeCategory = this.properties;
    this.kanbanService.setModalVisibility(ModalType.Task);
  }

  editTask(task: Task) {
    this.kanbanService.activeCategory = this.properties;
    this.kanbanService.activeTask = task;
    this.kanbanService.setModalVisibility(ModalType.EditTask);
  }

  drop(event: CdkDragDrop<Task[]>) {
    console.log(event);
    if (event.previousContainer === event.container)
      moveItemInArray(
        this.properties.tasks,
        event.previousIndex,
        event.currentIndex
      );
    else
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
  }

  handleTaskDeletion(task: Task) {
    this.kanbanService.activeCategory = this.properties;
    this.kanbanService.activeTask = task;
    this.kanbanService.removeTask();
  }

  handleCategoryDeletion() {
    this.kanbanService.activeCategory = this.properties;
    this.kanbanService.removeCategory();
  }
}
