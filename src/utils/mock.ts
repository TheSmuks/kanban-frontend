import { Category } from '../app/interfaces/category';
import { Task } from '../app/interfaces/task';

export function emptyTask(): Task {
  return {
    id: -1,
    name: '',
    description: '',
    categoryId: -1,
    position: -1,
  };
}
export function emptyCategory(): Category {
  return {
    id: -1,
    name: '',
    color: '',
    tasks: [],
    position: -1,
  };
}
