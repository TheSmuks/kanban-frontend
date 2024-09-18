import { Injectable } from '@angular/core';
import { Category } from '../interfaces/category';
import { Task } from '../interfaces/task';
import { BehaviorSubject, firstValueFrom, Observable } from 'rxjs';
import { ModalType } from '../enums/modal-type';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environment/environment';

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
  private _categories: BehaviorSubject<Category[]> = new BehaviorSubject<
    Category[]
  >([]);
  categories = this._categories.asObservable();
  private _activeModal = new BehaviorSubject<ModalType>(ModalType.Disabled);
  activeModal = this._activeModal.asObservable();
  private _contextMenuVisbility = new BehaviorSubject<boolean>(false);
  contextMenuVisbility = this._contextMenuVisbility.asObservable();
  private _isContextMenuHidden = new BehaviorSubject<boolean>(false);
  isContextMenuHidden = this._isContextMenuHidden.asObservable();

  activeCategory: Category | undefined;
  activeTask: Task | undefined;
  private apiEndPoint = environment.apiEndPoint;
  constructor(private http: HttpClient) {
    this.http
      .get<Category[]>(`${this.apiEndPoint}/categories`)
      .subscribe((categories) => {
        this._categories.next(categories);
      });
  }

  private swap(arr: Category[] | Task[] | [], src: number, dst: number) {
    let temp = arr[dst];
    arr[dst] = arr[src];
    arr[src] = temp;
  }

  private resetValues() {
    this.activeTask = undefined;
    this.activeCategory = undefined;
  }
  private getContext() {
    return {
      activeTask: this.activeTask!,
      activeCategory: this.activeCategory!,
    };
  }
  private performAction(
    checkType: CheckType,
    callback: (context: { activeTask: Task; activeCategory: Category }) => void
  ) {
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
    callback(this.getContext());
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
    this.performAction(CheckType.CategoryAndTask, (context) => {
      const { activeTask, activeCategory } = context;
      activeTask.categoryId = activeCategory.id;
      this.http
        .post<Task>(`${this.apiEndPoint}/task`, activeTask)
        .subscribe((createdTask) => {
          activeCategory.tasks.push(createdTask);
        });
    });
  }

  editTask() {
    this.performAction(CheckType.CategoryAndTask, (context) => {
      const { activeTask, activeCategory } = context;
      this.http
        .put<Task>(`${this.apiEndPoint}/task/${activeTask.id}`, activeTask)
        .subscribe((updatedTask: Task) =>
          Object.assign(activeTask, updatedTask)
        );
    });
  }

  removeTask() {
    this.performAction(CheckType.CategoryAndTask, (context) => {
      const { activeTask, activeCategory } = context;
      this.http
        .delete<Task>(`${this.apiEndPoint}/task/${activeTask.id}`)
        .subscribe((deletedTask: Task) => {
          activeCategory.tasks = activeCategory.tasks.filter(
            (t) => t.id !== deletedTask.id
          );
        });
    });
  }

  addCategory() {
    this.performAction(CheckType.Category, (context) => {
      const { activeTask, activeCategory } = context;
      this.http
        .post<Category>(`${this.apiEndPoint}/category`, activeCategory)
        .subscribe((createdCategory: Category) => {
          this._categories.next([
            ...this._categories.getValue(),
            createdCategory,
          ]);
        });
    });
  }

  updateCategory() {
    this.performAction(CheckType.Category, (context) => {
      const { activeTask, activeCategory } = context;
      this.http
        .put<Category>(
          `${this.apiEndPoint}/category/${activeCategory.id}`,
          activeCategory
        )
        .subscribe((updatedCategory: Category) =>
          Object.assign(activeCategory, updatedCategory)
        );
    });
  }

  removeCategory() {
    this.performAction(CheckType.Category, (context) => {
      const { activeTask, activeCategory } = context;
      this.http
        .delete<Category>(`${this.apiEndPoint}/category/${activeCategory.id}`)
        .subscribe((deletedCategory: Category) => {
          this._categories.next(
            this._categories
              .getValue()
              .filter((cat) => cat.id !== deletedCategory.id)
          );
        });
    });
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
