import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import axios from 'axios'

const TODO_API_URL = 'https://dummyjson.com/todos'

interface Todo {
  id: number
  todo: string
  completed: boolean
  userId: number
}
  interface Todo {
    id: number
    todo: string
    completed: boolean
    userId: number
  }

  interface TodosResponse {
    todos: Todo[]
    total: number
    skip: number
    limit: number
  }

  interface TodoState {
    items: Todo[]
    loading: boolean
    error: string | null
  }

  export const fetchTodos = createAsyncThunk('todos/fetchTodos', async () => {
    const response = await axios.get<TodosResponse>('https://dummyjson.com/todos')
    return response.data
  })

export const addTodo = createAsyncThunk('todos/addTodo', async (todo: { todo: string, userId: number }) => {
  const response = await axios.post(`${TODO_API_URL}/add`, {
    todo: todo.todo,
    completed: false,
    userId: todo.userId,
  })
  return response.data
})

export const updateTodo = createAsyncThunk('todos/updateTodo', async (todo: { id: number, todo: string, completed: boolean }) => {
  const response = await axios.put(`${TODO_API_URL}/${todo.id}`, {
    todo: todo.todo,
    completed: todo.completed
  })
  return response.data
})

export const deleteTodo = createAsyncThunk('todos/deleteTodo', async (id: number) => {
  await axios.delete(`${TODO_API_URL}/${id}`)
  return id
})

const todoSlice = createSlice({
  name: 'todos',
  initialState: {
    items: [],
    loading: false,
    error: null
  } as TodoState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchTodos.pending, (state) => {
        state.loading = true
      })
      .addCase(fetchTodos.fulfilled, (state, action) => {
        state.loading = false
        state.items = action.payload.todos
      })
      .addCase(addTodo.fulfilled, (state, action) => {
        state.items.push(action.payload)
      })
      .addCase(updateTodo.fulfilled, (state, action) => {
        const index = state.items.findIndex(todo => todo.id === action.payload.id)
        if (index !== -1) {
          state.items[index] = action.payload
        }
      })
      .addCase(deleteTodo.fulfilled, (state, action) => {
        console.log(action.payload,state.items,"delete");
        state.items = state.items.filter(todo => todo.id !== action.payload)
      })
      .addMatcher(
        (action) => action.type.endsWith('/rejected'),
        (state, action) => {
          state.loading = false
          state.error = action.error.message
        }
      )
  }
})

export default todoSlice.reducer
