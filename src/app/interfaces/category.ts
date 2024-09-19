import { Task } from "./task";

export interface Category {
    id: number;
    name: string;
    color: string;
    tasks: Task[];
    position: number;
}
