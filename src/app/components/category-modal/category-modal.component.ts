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
import { Category } from '../../interfaces/category';

@Component({
  selector: 'app-category-modal',
  standalone: true,
  imports: [ReactiveFormsModule, ModalComponent],
  templateUrl: './category-modal.component.html',
  styleUrl: './category-modal.component.css',
})
export class CategoryModalComponent {
  categoryForm = new FormGroup({
    name: new FormControl('', Validators.required),
    color: new FormControl('', Validators.required),
  });
  _category: Category | undefined;

  constructor(private kanbanService: KanbanService) {
    this._category = this.kanbanService.activeCategory;
    if (this._category) {
      this.categoryForm.setValue({
        name: this._category.name,
        color: this._category.color,
      });
    }
  }
  handleSubmit() {
    if (this._category) {
      if (
        this._category.name !== this.categoryForm.value.name ||
        this._category.color !== this.categoryForm.value.color
      ) {
        this._category.name = this.categoryForm.value.name!;
        this._category.color = this.categoryForm.value.color!;
        this.kanbanService.updateCategory();
      }
    } else {
      this.kanbanService.activeCategory = {
        id: -1,
        name: this.categoryForm.value.name!,
        color: this.categoryForm.value.color!,
        tasks: [],
      };
      this.kanbanService.addCategory();
    }
    this.kanbanService.setModalVisibility(ModalType.Disabled);
  }
}
