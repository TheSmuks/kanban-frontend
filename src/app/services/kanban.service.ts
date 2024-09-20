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

  private apiEndPoint = environment.apiEndPoint;
  constructor(private http: HttpClient) {
    this.http
      .get<Category[]>(`${this.apiEndPoint}/categories`)
      .subscribe((categories) => {
        this._categories.next(categories);
      });
  }

  private swap(arr: Category[] | Task[], src: number, dst: number) {
    arr[src].position = dst;
    arr[dst].position = src;
    let temp = arr[dst];
    arr[dst] = arr[src];
    arr[src] = temp;
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

  setModalType(type: ModalType) {
    this._activeModal.next(type);
  }
  private getCategory(categoryId: number) {
    return this._categories.getValue().find((cat) => cat.id === categoryId)!;
  }

  addTask(task: Task) {
    const category = this.getCategory(task.categoryId);
    task.position = category.tasks.length;
    this.http
      .post<Task>(`${this.apiEndPoint}/task`, task)
      .subscribe((createdTask) => {
        category.tasks.push(createdTask);
      });
  }

  updateTask(task: Task) {
    this.http
      .put<Task>(`${this.apiEndPoint}/task/${task.id}`, task)
      .subscribe((updatedTask: Task) => Object.assign(task, updatedTask));
  }

  removeTask(taskId: number) {
    this.http
      .delete<Task>(`${this.apiEndPoint}/task/${taskId}`)
      .subscribe((deletedTask: Task) => {
        const category = this.getCategory(deletedTask.categoryId);
        category.tasks = category.tasks.filter((t) => t.id !== deletedTask.id);
      });
  }

  addCategory(category: Category) {
    category.position = this._categories.getValue().length;
    this.http
      .post<Category>(`${this.apiEndPoint}/category`, category)
      .subscribe((createdCategory: Category) => {
        this._categories.next([
          ...this._categories.getValue(),
          createdCategory,
        ]);
      });
  }

  updateCategory(category: Category) {
    this.http
      .put<Category>(`${this.apiEndPoint}/category/${category.id}`, category)
      .subscribe((updatedCategory: Category) =>
        Object.assign(category, updatedCategory)
      );
  }

  removeCategory(categoryId: number) {
    this.http
      .delete<Category>(`${this.apiEndPoint}/category/${categoryId}`)
      .subscribe((deletedCategory: Category) => {
        this._categories.next(
          this._categories
            .getValue()
            .filter((cat) => cat.id !== deletedCategory.id)
        );
      });
  }

  moveCategory(categoryId: number, left: boolean) {
    const category: Category = this.getCategory(categoryId);
    let categories: Category[] = this._categories.getValue();
    const index: number = categories.indexOf(category);
    let didMove: boolean = false;
    if (left && index > 0) {
      this.swap(categories, index, index - 1);
      didMove = true;
    } else if (!left && index < categories.length - 1) {
      this.swap(categories, index, index + 1);
      didMove = true;
    }
    if (didMove) this.updateCategory(category);
  }
}
