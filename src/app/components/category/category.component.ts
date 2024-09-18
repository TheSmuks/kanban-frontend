import { Component, Input } from '@angular/core';
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

@Component({
  selector: 'app-task-category',
  standalone: true,
  imports: [TaskComponent, DragDropModule, CdkDropList],
  templateUrl: './category.component.html',
  styleUrl: './category.component.css',
})
export class CategoryComponent {
  @Input() properties: Category = {
    id: -1,
    name: '',
    color: '',
    tasks: [],
  };
  isContextMenuVisible: boolean = false;

  constructor(private kanbanService: KanbanService) {
    kanbanService.isContextMenuHidden.subscribe((val) => {
      if (val) this.isContextMenuVisible = false;
    });
  }

  addTask() {
    this.kanbanService.activeCategory = this.properties;
    this.kanbanService.setModalVisibility(ModalType.Task);
  }

  editTask(task: Task) {
    this.kanbanService.activeCategory = this.properties;
    this.kanbanService.activeTask = task;
    this.kanbanService.setModalVisibility(ModalType.Task);
  }

  drop(event: CdkDragDrop<Category>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(
        this.properties.tasks,
        event.previousIndex,
        event.currentIndex
      );
      // TODO: send update task with updated priority
    } else {
      transferArrayItem(
        event.previousContainer.data.tasks,
        event.container.data.tasks,
        event.previousIndex,
        event.currentIndex
      );
      // TODO: send update task with updated categoryId
    }
  }
  handleTaskDeletion(task: Task) {
    this.kanbanService.activeCategory = this.properties;
    this.kanbanService.activeTask = task;
    this.kanbanService.removeTask();
  }

  updateContextMenuVisbility(val: boolean) {
    this.kanbanService.updateContextMenuVisibility(val);
    this.isContextMenuVisible = val;
  }

  handleCategoryEdit() {
    this.kanbanService.activeCategory = this.properties;
    this.kanbanService.setModalVisibility(ModalType.Category);
    this.updateContextMenuVisbility(false);
  }

  handleCategoryDeletion() {
    this.kanbanService.activeCategory = this.properties;
    this.kanbanService.removeCategory();
    this.updateContextMenuVisbility(false);
  }

  handleCategoryClear() {
    this.properties.tasks = [];
    this.kanbanService.activeCategory = this.properties;
    this.kanbanService.updateCategory();
    this.updateContextMenuVisbility(false);
  }

  moveCategory(left: boolean) {
    this.kanbanService.activeCategory = this.properties;
    this.kanbanService.moveCategory(left);
    this.updateContextMenuVisbility(false);
  }
}
