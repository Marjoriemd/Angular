import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TaskService } from './services/task.service';
import { Task } from './models/task.model';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App implements OnInit {

  private taskService = inject(TaskService);

  tasks: Task[] = [];
  filter: 'all' | 'pending' | 'done' = 'all';

  // Modal agregar/editar
  showModal = false;
  isEditing = false;
  editingId: string | null = null;

  // Modal confirmar eliminar
  showDeleteModal = false;
  deletingId: string | null = null;
  deletingTitle = '';

  // Formulario
  form: Omit<Task, 'id' | 'completed' | 'createdAt'> = {
    title: '',
    materia: '',
    fechaEntrega: ''
  };

  get filteredTasks(): Task[] {
    switch (this.filter) {
      case 'pending': return this.tasks.filter(t => !t.completed);
      case 'done':    return this.tasks.filter(t => t.completed);
      default:        return this.tasks;
    }
  }

  get completedCount(): number { return this.tasks.filter(t => t.completed).length; }
  get pendingCount(): number   { return this.tasks.filter(t => !t.completed).length; }
  get progressPercent(): number {
    if (!this.tasks.length) return 0;
    return Math.round((this.completedCount / this.tasks.length) * 100);
  }

  ngOnInit(): void {
    this.taskService.getTasks().subscribe(tasks => this.tasks = tasks);
  }

  openAddModal(): void {
    this.isEditing = false;
    this.editingId = null;
    this.form = { title: '', materia: '', fechaEntrega: '' };
    this.showModal = true;
  }

  openEditModal(task: Task): void {
    this.isEditing = true;
    this.editingId = task.id!;
    this.form = {
      title: task.title,
      materia: task.materia || '',
      fechaEntrega: task.fechaEntrega || ''
    };
    this.showModal = true;
  }

  closeModal(): void {
    this.showModal = false;
  }

  saveTask(): void {
    if (!this.form.title.trim() || !this.form.materia.trim()) return;

    if (this.isEditing && this.editingId) {
      this.taskService.updateTaskFull(this.editingId, {
        title: this.form.title.trim(),
        materia: this.form.materia.trim(),
        fechaEntrega: this.form.fechaEntrega
      });
    } else {
      this.taskService.addTask(
        this.form.title.trim(),
        this.form.materia.trim(),
        this.form.fechaEntrega
      );
    }
    this.closeModal();
  }

  toggleTask(task: Task): void {
    this.taskService.updateTask(task.id!, !task.completed);
  }

  confirmDelete(task: Task): void {
    this.deletingId = task.id!;
    this.deletingTitle = task.title;
    this.showDeleteModal = true;
  }

  cancelDelete(): void {
    this.showDeleteModal = false;
    this.deletingId = null;
    this.deletingTitle = '';
  }

  executeDelete(): void {
    if (this.deletingId) {
      this.taskService.deleteTask(this.deletingId);
    }
    this.cancelDelete();
  }

  trackById(_: number, task: Task): string { return task.id ?? ''; }

  isOverdue(fechaEntrega: string): boolean {
    if (!fechaEntrega) return false;
    return new Date(fechaEntrega) < new Date();
  }
}
