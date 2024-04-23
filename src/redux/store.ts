import { configureStore } from '@reduxjs/toolkit';
import { todoSlice } from './todoReducer';

function loadFromLocalStorage() {
  try {
    const serializedState = localStorage.getItem('todos');
    if (serializedState === null) return undefined;
    return JSON.parse(serializedState);
  } catch (e) {
    console.error("State load failed:", e);
    return undefined;
  }
}

function saveToLocalStorage(state: any) {
  try {
    const serializedState = JSON.stringify(state.todos); 
    localStorage.setItem('todos', serializedState);
  } catch (e) {
    console.error("State save failed:", e);
  }
}

const persistedState = loadFromLocalStorage();

export const store = configureStore({
  reducer: {
    todos: todoSlice.reducer 
  },
  preloadedState: persistedState ? { todos: persistedState } : undefined
});

store.subscribe(() => {
  saveToLocalStorage(store.getState());
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
