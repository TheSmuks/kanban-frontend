import { Component, Input } from '@angular/core';
import { KanbanService } from '../../services/kanban.service';
import { ModalType } from '../../enums/modal-type';

@Component({
  selector: 'app-modal',
  standalone: true,
  imports: [],
  templateUrl: './modal.component.html',
  styleUrl: './modal.component.css',
  host: {
    class:
      'absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex justify-center items-center size-full',
    '(click)': 'hideModal()',
  },
})
export class ModalComponent {
  @Input() name: string = "";
  constructor(private kanbanService: KanbanService) {}
  hideModal(){
    this.kanbanService.setModalType(ModalType.Disabled);
  }
}
