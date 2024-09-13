import { Task } from "./task";

export interface TaskCategory {
    id: string;
    name: string;
    color: string;
    tasks: Task[];
}
