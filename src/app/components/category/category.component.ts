import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Category as Category } from '../../interfaces/category';
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
import { emptyCategory } from '../../../utils/mock';

@Component({
  selector: 'app-task-category',
  standalone: true,
  imports: [TaskComponent, DragDropModule, CdkDropList],
  templateUrl: './category.component.html',
  styleUrl: './category.component.css',
})
export class CategoryComponent {
  @Input() properties: Category = emptyCategory();
  @Output() onTaskEdit: EventEmitter<Task> = new EventEmitter<Task>();
  @Output() onCategoryEdit: EventEmitter<Category> =
    new EventEmitter<Category>();
  isContextMenuVisible: boolean = false;

  constructor(private kanbanService: KanbanService) {
    kanbanService.isContextMenuHidden.subscribe((val) => {
      if (val) this.isContextMenuVisible = false;
    });
  }

  addTask() {
    this.onTaskEdit.emit({
      id: -1,
      name: '',
      description: '',
      categoryId: this.properties.id,
      position: -1,
    });
    this.kanbanService.setModalType(ModalType.Task);
  }

  emitTaskEdit(task: Task) {
    this.onTaskEdit.emit(task);
    this.kanbanService.setModalType(ModalType.Task);
  }

  drop(event: CdkDragDrop<Category>) {
    if (event.previousContainer === event.container) {
      if (event.previousIndex === event.currentIndex) return;
      const sourceTask = this.properties.tasks[event.currentIndex];
      const destinationTask = this.properties.tasks[event.previousIndex];
      sourceTask.position = event.previousIndex;
      destinationTask.position = event.currentIndex;
      moveItemInArray(
        this.properties.tasks,
        event.previousIndex,
        event.currentIndex
      );
      this.kanbanService.updateTask(sourceTask);
      this.kanbanService.updateTask(destinationTask);
    } else {
      event.previousContainer.data.tasks[event.previousIndex].categoryId =
        event.container.data.id;
      transferArrayItem(
        event.previousContainer.data.tasks,
        event.container.data.tasks,
        event.previousIndex,
        event.currentIndex
      );
      event.container.data.tasks.forEach((task, index) => {
        task.position = index;
        this.kanbanService.updateTask(task);
      });
    }
  }
  handleTaskDeletion(task: Task) {
    this.kanbanService.removeTask(task.id);
  }

  updateContextMenuVisbility(val: boolean) {
    this.kanbanService.updateContextMenuVisibility(val);
    this.isContextMenuVisible = val;
  }

  handleCategoryEdit() {
    this.onCategoryEdit.emit(this.properties);
    this.kanbanService.setModalType(ModalType.Category);
    this.updateContextMenuVisbility(false);
  }

  handleCategoryDeletion() {
    this.kanbanService.removeCategory(this.properties.id);
    this.updateContextMenuVisbility(false);
  }

  handleCategoryClear() {
    this.properties.tasks = [];
    this.kanbanService.updateCategory(this.properties);
    this.updateContextMenuVisbility(false);
  }

  moveCategory(left: boolean) {
    this.kanbanService.moveCategory(this.properties.id, left);
    this.updateContextMenuVisbility(false);
  }
}
