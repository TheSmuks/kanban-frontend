import { Injectable } from '@angular/core';
import {
  InMemoryDbService,
  ParsedRequestUrl,
  RequestInfo,
  RequestInfoUtilities,
} from 'angular-in-memory-web-api';
import { Task } from '../interfaces/task';
import { Category } from '../interfaces/category';

@Injectable({
  providedIn: 'root',
})
export class MockApiService implements InMemoryDbService {
  private tasks: Task[] = [
    {
      id: 1,
      name: 'Sample task',
      description: 'This is a sample task.',
      categoryId: 1,
      position: 0,
    },
  ];
  private categories: Category[] = [
    {
      id: 1,
      name: 'Todo',
      color: '#BBBBBB',
      position: 0,
      tasks: [this.tasks[0]],
    },
    { id: 2, name: 'In progress', color: '#FFBF00', position: 1, tasks: [] },
    { id: 3, name: 'Completed', color: '#228B22', position: 2, tasks: [] },
  ];
  private taskIdCounter = Math.max(...this.tasks.map((task) => task.id)) + 1;
  private categoryIdCounter =
    Math.max(...this.categories.map((category) => category.id)) + 1;
  createDb() {
    return { tasks: this.tasks, categories: this.categories };
  }
  parseRequestUrl(url: string, utils: RequestInfoUtilities): ParsedRequestUrl {
    const newUrl = url
      .replace(/\/task(\/|$)/, '/tasks$1')
      .replace(/\/category(\/|$)/, '/categories$1');
    return utils.parseRequestUrl(newUrl);
  }
  post(reqInfo: RequestInfo) {
    const collectionName = reqInfo.collectionName;
    const collection = reqInfo.collection;
    if (collectionName === 'tasks') {
      const newTask = reqInfo.utils.getJsonBody(reqInfo.req) as Task;
      newTask.id = this.taskIdCounter++;
      collection.push(newTask);
      return reqInfo.utils.createResponse$(() => ({
        body: newTask,
        status: 200,
      }));
    } else if (collectionName === 'categories') {
      const newCategory = reqInfo.utils.getJsonBody(reqInfo.req) as Category;
      newCategory.id = this.categoryIdCounter++;
      collection.push(newCategory);
      return reqInfo.utils.createResponse$(() => ({
        body: newCategory,
        status: 200,
      }));
    }
    return undefined;
  }
  delete(reqInfo: RequestInfo) {
    const collectionName = reqInfo.collectionName || reqInfo.url.split('/')[1];
    const id = Number(reqInfo.url.split('/')[-1]);
    const collection = reqInfo.collection;
    if (collectionName === 'tasks') {
      const taskIndex = collection.findIndex((task: Task) => task.id === id);
      if (taskIndex !== -1) {
        const deletedTask = collection.splice(taskIndex, 1)[0];
        return reqInfo.utils.createResponse$(() => ({
          body: deletedTask,
          status: 200,
        }));
      }
    } else if (collectionName === 'categories') {
      const categoryIndex = collection.findIndex(
        (category: Category) => category.id === id
      );
      if (categoryIndex !== -1) {
        const deletedCategory = collection.splice(categoryIndex, 1)[0];
        return reqInfo.utils.createResponse$(() => ({
          body: deletedCategory,
          status: 200,
        }));
      }
    }
    return undefined;
  }
}
