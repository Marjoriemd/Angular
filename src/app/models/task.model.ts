export interface Task {
  id?: string;
  title: string;
  materia: string;
  fechaEntrega: string;
  completed: boolean;
  createdAt: Date;
}
