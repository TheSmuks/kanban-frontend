import { Component, Input } from '@angular/core';
import { ModalComponent } from '../modal/modal.component';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { KanbanService } from '../../services/kanban.service';
import { ModalType } from '../../enums/modal-type';
import { TaskCategory } from '../../interfaces/task-category';

@Component({
  selector: 'app-category-modal',
  standalone: true,
  imports: [ReactiveFormsModule, ModalComponent],
  templateUrl: './category-modal.component.html',
  styleUrl: './category-modal.component.css',
})
export class CategoryModalComponent {
  private _category: TaskCategory = {
    id: '-1',
    name: '',
    color: '',
    tasks: [],
  };
  categoryForm = new FormGroup({
    name: new FormControl('', Validators.required),
    color: new FormControl('', Validators.required),
  });
  constructor(private kanbanService: KanbanService) {}
  handleSubmit() {
    this._category.name = this.categoryForm.value.name!;
    this._category.color = this.categoryForm.value.color!;
    this.kanbanService.activeCategory = this._category;
    this.kanbanService.addCategory();
    this.kanbanService.setModalVisibility(ModalType.Disabled);
  }
}
