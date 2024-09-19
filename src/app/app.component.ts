import { Component, HostListener } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CategoryComponent } from './components/category/category.component';
import { Category } from './interfaces/category';
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
    CategoryComponent,
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
  categories: Category[] = [];
  activeModal: ModalType = ModalType.Disabled;
  isTaskModal: boolean = false;
  isContextMenuActive: boolean = false;
  ModalType = ModalType;
  editedTask: Task = {
    id: -1,
    name: '',
    description: '',
    categoryId: -1,
    position: -1,
  };
  editedCategory: Category = {
    id: -1,
    name: '',
    color: '',
    tasks: [],
    position: -1,
  };
  constructor(private kanbanService: KanbanService) {
    kanbanService.activeModal.subscribe((val) => (this.activeModal = val));
    kanbanService.categories.subscribe((val) => (this.categories = val));
    kanbanService.contextMenuVisbility.subscribe(
      (val) => (this.isContextMenuActive = val)
    );
  }

  @HostListener('window:keydown.esc')
  handleEsc() {
    this.kanbanService.setModalType(ModalType.Disabled);
  }
  @HostListener('window:click')
  handleClick() {
    if (this.isContextMenuActive) {
      this.kanbanService.hideContextMenu();
    }
  }
  addCategory() {
    this.kanbanService.setModalType(ModalType.Category);
  }
}
