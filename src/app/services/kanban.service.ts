import { Injectable } from '@angular/core';
import { TaskCategory } from '../interfaces/task-category';
import { Task } from '../interfaces/task';
import { BehaviorSubject } from 'rxjs';
import { v4 as uuid } from 'uuid';
import { ModalType } from '../enums/modal-type';

@Injectable({
  providedIn: 'root',
})
export class KanbanService {
  private _categories: BehaviorSubject<TaskCategory[]> = new BehaviorSubject<
    TaskCategory[]
  >([]);
  categories = this._categories.asObservable();
  private _activeModal = new BehaviorSubject<ModalType>(ModalType.Disabled);
  activeModal = this._activeModal.asObservable();
  activeCategory: TaskCategory | undefined;
  activeTask: Task | undefined;
  constructor() {}

  _resetValues() {
    this.activeTask = undefined;
    this.activeCategory = undefined;
  }

  setModalVisibility(type: ModalType) {
    this._activeModal.next(type);
  }

  addTask() {
    this.activeTask!.id = uuid();
    this.activeCategory!.tasks.push(this.activeTask!);
    this._resetValues();
    // Something backend?
  }
  removeTask() {
    this.activeCategory!.tasks = this.activeCategory!.tasks.filter(
      (t) => t.id !== this.activeTask!.id
    );
    this._resetValues();
    // Something backend?
  }

  addCategory() {
    this._categories.next([
      ...this._categories.getValue(),
      this.activeCategory!,
    ]);
    this._resetValues();
    // Something backend?
  }
  removeCategory() {
    this._categories.next(
      this._categories
        .getValue()
        .filter((cat) => cat.id !== this.activeCategory!.id)
    );
    this._resetValues();
    // Something backend?
  }
}
