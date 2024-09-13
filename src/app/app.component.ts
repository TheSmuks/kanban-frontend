import { Component, HostListener } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { TaskCategoryComponent } from './components/task-category/task-category.component';
import { TaskCategory } from './interfaces/task-category';
import { KanbanService } from './services/kanban.service';
import { TaskModalComponent } from './components/task-modal/task-modal.component';
import { CdkDropListGroup } from '@angular/cdk/drag-drop';
import { CategoryModalComponent } from './components/category-modal/category-modal.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { ModalType } from './enums/modal-type';
import { Task } from './interfaces/task';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    TaskCategoryComponent,
    TaskModalComponent,
    CategoryModalComponent,
    CdkDropListGroup,
    NavbarComponent,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  title = 'kanban';
  categories: TaskCategory[] = [];
  activeModal: ModalType = ModalType.Disabled;
  isTaskModal: boolean = false;
  ModalType = ModalType;
  constructor(private kanbanService: KanbanService) {
    kanbanService.activeModal.subscribe((val) => (this.activeModal = val));
    kanbanService.categories.subscribe((val) => (this.categories = val));
    this.categories.push({
      id: '1',
      name: 'Todo',
      color: 'gray',
      tasks: [{ id: '1', name: 'Task 1', desc: 'test' }],
    });
    this.categories.push({
      id: '2',
      name: 'In progress',
      color: 'orange',
      tasks: [],
    });
    this.categories.push({
      id: '3',
      name: 'Completed',
      color: 'green',
      tasks: [],
    });
  }

  @HostListener('window:keydown.esc')
  handleEsc() {
    this.kanbanService.setModalVisibility(ModalType.Disabled);
  }

  addCategory() {
    this.kanbanService.setModalVisibility(ModalType.Category);
    // this.categories.push({ id: '', name: 'test', color: 'FFFFFF', tasks: [] });
    console.log(this.categories);
  }
}
