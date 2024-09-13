import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Task } from '../../interfaces/task';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { KanbanService } from '../../services/kanban.service';
import { ModalType } from '../../enums/modal-type';

@Component({
  selector: 'app-task',
  standalone: true,
  imports: [DragDropModule],
  templateUrl: './task.component.html',
  styleUrl: './task.component.css',
})
export class TaskComponent {
  @Input() properties: Task = { id: '', name: '', desc: '' };
  @Input() color: string = '';
  @Output() onDelete: EventEmitter<Task> = new EventEmitter<Task>();
  @Output() onTaskEdit: EventEmitter<Task> = new EventEmitter<Task>();

  constructor(private kanbanService: KanbanService) {}
  emitDelete() {
    this.onDelete.emit(this.properties);
  }

  emitEdit() {
    this.onTaskEdit.emit(this.properties);
    this.kanbanService.setModalVisibility(ModalType.EditTask);
  }
}
