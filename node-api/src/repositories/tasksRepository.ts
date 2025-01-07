import fs from "fs";

interface Task {
  id: number;
  text: string;
  summary: string | null;
  lang: string; 
}

const FILE_PATH = "./tasks.json";

export class TasksRepository {
  private tasks: Task[] = [];

  constructor() {
    this.loadTasks();
  }

  private saveTasks() {
    fs.writeFileSync(FILE_PATH, JSON.stringify(this.tasks, null, 2));
  }

  private loadTasks() {
    if (fs.existsSync(FILE_PATH)) {
      this.tasks = JSON.parse(fs.readFileSync(FILE_PATH, "utf-8"));
    }
  }

  createTask(text: string, lang: string): Task {
    const task: Task = {
      id: Date.now(),
      text,
      summary: null,
      lang, 
    };
    this.tasks.push(task);
    this.saveTasks();
    return task;
  }

  updateTask(id: number, summary: string): Task | null {
    const taskIndex = this.tasks.findIndex((t) => t.id === id);
    if (taskIndex > -1) {
      this.tasks[taskIndex].summary = summary;
      this.saveTasks();
      return this.tasks[taskIndex];
    }
    return null;
  }

  getTaskById(id: number): Task | null {
    return this.tasks.find((t) => t.id === id) || null;
  }

  getAllTasks(): Task[] {
    return this.tasks;
  }

  deleteTask(id: number): void {
    this.tasks = this.tasks.filter((task) => task.id !== id);
    this.saveTasks();
  }
}
