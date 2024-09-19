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
import { Task } from '../../interfaces/task';

@Component({
  selector: 'app-task-modal',
  standalone: true,
  imports: [ModalComponent, ReactiveFormsModule],
  templateUrl: './task-modal.component.html',
  styleUrl: './task-modal.component.css',
})
export class TaskModalComponent {
  taskForm = new FormGroup({
    name: new FormControl('', Validators.required),
    description: new FormControl('', Validators.required),
  });
  @Input() task: Task = {
    id: -1,
    name: '',
    description: '',
    categoryId: -1,
    position: -1,
  };
  private receivedInput: boolean = false;
  constructor(private kanbanService: KanbanService) {}
  ngOnChanges() {
    if (!this.receivedInput && this.task.id !== -1) {
      this.receivedInput = true;
      this.taskForm.setValue({
        name: this.task.name,
        description: this.task.description,
      });
    }
  }
  handleSubmit() {
    if (this.task.id !== -1) {
      if (
        this.task.name !== this.taskForm.value.name ||
        this.task.description !== this.taskForm.value.description
      ) {
        this.task.name = this.taskForm.value.name!;
        this.task.description = this.taskForm.value.description!;
        this.kanbanService.updateTask(this.task);
      }
    } else {
      this.task = {
        id: -1,
        name: this.taskForm.value.name!,
        description: this.taskForm.value.description!,
        categoryId: this.task.categoryId,
        position: -1,
      };
      this.kanbanService.addTask(this.task);
    }
    this.kanbanService.setModalType(ModalType.Disabled);
  }
}
