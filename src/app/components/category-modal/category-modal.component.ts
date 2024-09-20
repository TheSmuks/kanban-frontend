import { Component, EventEmitter, Input, Output } from '@angular/core';
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
import { emptyCategory } from '../../../utils/mock';

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
    color: new FormControl(''),
  });
  @Input() category: Category = emptyCategory();
  @Output() onClose: EventEmitter<boolean> = new EventEmitter<boolean>();
  private receivedInput: boolean = false;
  constructor(private kanbanService: KanbanService) {}
  ngOnChanges() {
    if (!this.receivedInput && this.category.id !== -1) {
      this.receivedInput = true;
      this.categoryForm.setValue({
        name: this.category.name,
        color: this.category.color,
      });
    }
  }
  handleSubmit() {
    if (this.category.id !== -1) {
      if (
        this.category.name !== this.categoryForm.value.name ||
        this.category.color !== this.categoryForm.value.color
      ) {
        this.category.name = this.categoryForm.value.name!;
        this.category.color = this.categoryForm.value.color!;
        this.kanbanService.updateCategory(this.category);
      }
    } else {
      this.category = {
        id: -1,
        name: this.categoryForm.value.name!,
        color: this.categoryForm.value.color!,
        tasks: [],
        position: -1,
      };
      this.kanbanService.addCategory(this.category);
    }
    this.onClose.emit(true);
    this.kanbanService.setModalType(ModalType.Disabled);
  }
}
