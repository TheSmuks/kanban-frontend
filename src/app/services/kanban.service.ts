import { Injectable } from '@angular/core';
import { TaskCategory } from '../interfaces/task-category';
import { Task } from '../interfaces/task';
import { BehaviorSubject } from 'rxjs';
import { v4 as uuid } from 'uuid';
import { ModalType } from '../enums/modal-type';

enum CheckType {
  Category,
  Task,
  CategoryAndTask,
  None,
}

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
  private _contextMenuVisbility = new BehaviorSubject<boolean>(false);
  contextMenuVisbility = this._contextMenuVisbility.asObservable();
  private _isContextMenuHidden = new BehaviorSubject<boolean>(false);
  isContextMenuHidden = this._isContextMenuHidden.asObservable();

  activeCategory: TaskCategory | undefined;
  activeTask: Task | undefined;
  constructor() {}

  private swap(arr: TaskCategory[] | Task[] | [], src: number, dst: number) {
    let temp = arr[dst];
    arr[dst] = arr[src];
    arr[src] = temp;
  }

  private resetValues() {
    this.activeTask = undefined;
    this.activeCategory = undefined;
  }

  private performAction(checkType: CheckType, callback: () => void) {
    switch (checkType) {
      case CheckType.Category:
        if (this.activeCategory) break;
        return;
      case CheckType.Task:
        if (this.activeTask) break;
        return;
      case CheckType.CategoryAndTask:
        if (this.activeCategory && this.activeTask) break;
        return;
      case CheckType.None:
        break;
    }
    callback();
    this.resetValues();
  }

  hideContextMenu() {
    this._isContextMenuHidden.next(true);
  }

  updateContextMenuVisibility(val: boolean) {
    if (this._contextMenuVisbility.getValue()) {
      this._isContextMenuHidden.next(true);
    }
    this._contextMenuVisbility.next(val);
  }

  setModalVisibility(type: ModalType) {
    if (type === ModalType.Disabled) {
      this.resetValues();
    }
    this._activeModal.next(type);
  }

  addTask() {
    this.performAction(CheckType.CategoryAndTask, () => {
      this.activeTask!.id = uuid();
      this.activeCategory!.tasks.push(this.activeTask!);
    });
    // Something backend?
  }

  editTask() {
    this.performAction(CheckType.CategoryAndTask, () => {
      //Backend stuff
    });
  }

  removeTask() {
    this.performAction(CheckType.CategoryAndTask, () => {
      this.activeCategory!.tasks = this.activeCategory!.tasks.filter(
        (t) => t.id !== this.activeTask!.id
      );
    });
    // Something backend?
  }

  addCategory() {
    this.performAction(CheckType.Category, () => {
      this._categories.next([
        ...this._categories.getValue(),
        this.activeCategory!,
      ]);
    });
    // Something backend?
  }

  editCategory() {
    this.performAction(CheckType.Category, () => {
      //Backend stuff
    });
  }

  removeCategory() {
    this.performAction(CheckType.Category, () => {
      this._categories.next(
        this._categories
          .getValue()
          .filter((cat) => cat.id !== this.activeCategory!.id)
      );
    });
    // Something backend?
  }

  clearCategory() {
    this.performAction(CheckType.Category, () => {
      this.activeCategory!.tasks = [];
      this.resetValues();
    });
    // TODO: Backend
  }

  moveCategory(left: boolean) {
    this.performAction(CheckType.Category, () => {
      let categories = this._categories.getValue();
      const index = categories.indexOf(this.activeCategory!);
      if (left && index > 0) {
        this.swap(categories, index, index - 1);
      } else if (!left && index < categories.length - 1) {
        this.swap(categories, index, index + 1);
      }
    });
  }
}
