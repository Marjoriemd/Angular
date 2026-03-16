import { Injectable, inject } from '@angular/core';
import {
  Firestore,
  collection,
  collectionData,
  addDoc,
  doc,
  updateDoc,
  deleteDoc,
  query
} from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { Task } from '../models/task.model';

@Injectable({ providedIn: 'root' })
export class TaskService {

  private firestore = inject(Firestore);

  getTasks(): Observable<Task[]> {
    const q = query(collection(this.firestore, 'tasks'));
    return collectionData(q, { idField: 'id' }) as Observable<Task[]>;
  }

  addTask(title: string, materia: string, fechaEntrega: string): Promise<void> {
    const newTask: Omit<Task, 'id'> = {
      title,
      materia,
      fechaEntrega,
      completed: false,
      createdAt: new Date()
    };
    return addDoc(collection(this.firestore, 'tasks'), newTask).then(() => {});
  }

  updateTask(id: string, completed: boolean): Promise<void> {
    return updateDoc(doc(this.firestore, `tasks/${id}`), { completed });
  }

  updateTaskFull(id: string, data: { title: string; materia: string; fechaEntrega: string }): Promise<void> {
    return updateDoc(doc(this.firestore, `tasks/${id}`), { ...data });
  }

  deleteTask(id: string): Promise<void> {
    return deleteDoc(doc(this.firestore, `tasks/${id}`));
  }
}
