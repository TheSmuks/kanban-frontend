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
  _task: Task | undefined;

  constructor(private kanbanService: KanbanService) {
    this._task = this.kanbanService.activeTask;
    if (this._task) {
      this.taskForm.setValue({
        name: this._task.name,
        description: this._task.desc,
      });
    }
  }
  handleSubmit() {
    if (this._task) {
      if (
        this._task.name !== this.taskForm.value.name ||
        this._task.desc !== this.taskForm.value.description
      ) {
        this._task.name = this.taskForm.value.name!;
        this._task.desc = this.taskForm.value.description!;
        this.kanbanService.editTask();
      }
    } else {
      this.kanbanService.activeTask = {
        id: '-1',
        name: this.taskForm.value.name!,
        desc: this.taskForm.value.description!,
      };
      this.kanbanService.addTask();
    }
    this.kanbanService.setModalVisibility(ModalType.Disabled);
  }
}
