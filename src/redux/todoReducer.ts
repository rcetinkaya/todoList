import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { nanoid } from 'nanoid';

export interface Todo {
  id: string;
  title: string;
  description: string;
  status: 'todo' | 'inProgress' | 'done';
  completed: boolean;  
  comments: string[];
}


interface TodoState {
  todos: Todo[];
}

const initialState: TodoState = {
  todos: []
};

export const todoSlice = createSlice({
  name: 'todos',
  initialState,
  reducers: {
    addTodo: (state, action: PayloadAction<Omit<Todo, 'id'>>) => {
      const newTodo = { ...action.payload, id: nanoid() };  
      state.todos.push(newTodo);
    },
    updateTodoStatus: (state, action: PayloadAction<{ id: string; newStatus: Todo['status'] }>) => {
      const index = state.todos.findIndex(todo => todo.id === action.payload.id);
      if (index !== -1) {
        state.todos[index].status = action.payload.newStatus;
      }
    },
    addComment: (state, action: PayloadAction<{ id: string; comment: string }>) => {
      const index = state.todos.findIndex(todo => todo.id === action.payload.id);
      if (index !== -1) {
        state.todos[index].comments.push(action.payload.comment);
      }
    },
    toggleTodo: (state, action: PayloadAction<string>) => {  
      const index = state.todos.findIndex(todo => todo.id === action.payload);
      if (index !== -1) {
        state.todos[index].completed = !state.todos[index].completed;
      }
    },
    removeTodo: (state, action: PayloadAction<string>) => {  
      state.todos = state.todos.filter(todo => todo.id !== action.payload);
    },
    reorderTodo: (state, action: PayloadAction<{ startIndex: number, endIndex: number, status: Todo['status'] }>) => {
      const { startIndex, endIndex, status } = action.payload;
      const filteredTodos = state.todos.filter(todo => todo.status === status);
      const result = Array.from(filteredTodos);
      const [removed] = result.splice(startIndex, 1);
      result.splice(endIndex, 0, removed);
    

      state.todos = state.todos.map(todo => {
        const index = result.findIndex(t => t.id === todo.id);
        if (index > -1 && todo.status === status) {
          return result[index];
        }
        return todo;
      });
    }
  },
});

export const { addTodo, updateTodoStatus,addComment, toggleTodo, removeTodo, reorderTodo } = todoSlice.actions;

export default todoSlice.reducer;
