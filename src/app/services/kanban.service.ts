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

  private swap(arr: TaskCategory[] | Task[] | [], src: number, dst: number) {
    let temp = arr[dst];
    arr[dst] = arr[src];
    arr[src] = temp;
  }

  _resetValues() {
    this.activeTask = undefined;
    this.activeCategory = undefined;
  }

  setModalVisibility(type: ModalType) {
    if (type === ModalType.Disabled) {
      this._resetValues();
    }
    this._activeModal.next(type);
  }

  addTask() {
    this.activeTask!.id = uuid();
    this.activeCategory!.tasks.push(this.activeTask!);
    // Something backend?
  }

  editTask() {
    //Backend stuff
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

  clearCategory() {
    this.activeCategory!.tasks = [];
    this._resetValues();
    // TODO: Backend
  }

  moveCategory(left: boolean) {
    let categories = this._categories.getValue();
    const index = categories.indexOf(this.activeCategory!);
    console.log(index, categories.length);

    if (left && index > 0) {
      this.swap(categories, index, index - 1);
    } else if (!left && index < categories.length - 1) {
      this.swap(categories, index, index + 1);
    }
  }
}
