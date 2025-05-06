import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TodoService, Todo } from '../../services/todo.service';

@Component({
  selector: 'app-todo',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './todo.component.html',
  styleUrls: ['./todo.component.css']
})
export class TodoComponent implements OnInit {
  todos: Todo[] = [];
  newTitle = '';
  editingTodoId: number | null = null;
  editedTitle = '';

  constructor(private todoService: TodoService) {}

  ngOnInit(): void {
    this.loadTodos();
  }

  loadTodos() {
    this.todoService.getTodos().subscribe((data: Todo[]) => {
      this.todos = data;
    });
  }

  addTodo() {
    const title = this.newTitle.trim();
    if (!title) return;

    this.todoService.addTodo({ title, completed: false }).subscribe((todo: Todo) => {
      this.todos.push(todo);
      this.newTitle = '';
    });
  }

  toggleCompleted(todo: Todo) {
    todo.completed = !todo.completed;
    this.todoService.updateTodo(todo).subscribe();
  }

  deleteTodo(id: number) {
    this.todoService.deleteTodo(id).subscribe(() => {
      this.todos = this.todos.filter(t => t.id !== id);
    });
  }

  startEdit(todo: Todo) {
    this.editingTodoId = todo.id;
    this.editedTitle = todo.title;
  }

  saveEdit(todo: Todo) {
    const trimmed = this.editedTitle.trim();
    if (!trimmed) return;

    todo.title = trimmed;
    this.todoService.updateTodo(todo).subscribe(() => {
      this.editingTodoId = null;
    });
  }

  cancelEdit() {
    this.editingTodoId = null;
  }
}
