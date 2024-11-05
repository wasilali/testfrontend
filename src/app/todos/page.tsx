"use client"
import React, { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { 
  Box, 
  Typography, 
  TextField, 
  Button, 
  IconButton, 
  Paper, 
  AppBar, 
  Toolbar, 
  Checkbox,
  CircularProgress 
} from '@mui/material'
import DeleteIcon from '@mui/icons-material/Delete'
import EditIcon from '@mui/icons-material/Edit'
import LogoutIcon from '@mui/icons-material/Logout'
import AuthModal from '@/components/auth/AuthModal'
import { logout } from '@/store/slices/authSlice'
import { fetchTodos, addTodo, updateTodo, deleteTodo } from '@/store/slices/todoSlice'
import { AppDispatch } from '@/store/store'

const TodoPage = () => {
  const dispatch = useDispatch<AppDispatch>()
  const { isAuthenticated, isVerified, user } = useSelector((state: any) => state.auth)
  const { items, loading } = useSelector((state: any) => state.todos)
  
  const [inputText, setInputText] = useState('')
  const [editingTodo, setEditingTodo] = useState<{ id: number, text: string } | null>(null)

  const [authModal, setAuthModal] = useState({
    open: true,
    mode: 'signup' as 'login' | 'signup' | 'forgot' | 'otp',
    email: ''
  })

  useEffect(() => {
    if (isAuthenticated && isVerified) {
      dispatch(fetchTodos())
    }
  }, [isAuthenticated, isVerified])

  const handleAddTodo = () => {
    if (inputText.trim()) {
      dispatch(addTodo({ 
        todo: inputText, 
        userId: 1, // Using default userId since it's a dummy API
        completed: false 
      }))
      setInputText('')
    }
  }

  const handleUpdateTodo = (todo: any) => {
    dispatch(updateTodo({
      id: todo.id,
      todo: todo.todo,
      completed: !todo.completed,
      userId: todo.userId
    }))
  }

  const handleEditTodo = (id: number, newText: string) => {
    const todo = items.find((t: any) => t.id === id)
    if (todo) {
      dispatch(updateTodo({
        ...todo,
        todo: newText
      }))
      setEditingTodo(null)
    }
  }

  const handleDeleteTodo = (id: number) => {
    dispatch(deleteTodo(id))
  }

  console.log(items);
  

  return (
    <div className="flex items-center flex-col min-h-screen bg-gray-100">
      {isAuthenticated && isVerified && (
        <AppBar position="static" className="bg-gray-800">
          <Toolbar>
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
              {user?.email} - Total Todos: {items.length || 0}
            </Typography>
            <IconButton color="inherit" onClick={() => dispatch(logout())}>
              <LogoutIcon />
            </IconButton>
          </Toolbar>
        </AppBar>
      )}

      {(!isAuthenticated || !isVerified) && (
        <AuthModal 
          open={authModal.open}
          mode={authModal.mode}
          email={authModal.email}
          onClose={() => setAuthModal({ ...authModal, open: false })}
          onModeChange={(newMode, email) => 
            setAuthModal({ 
              open: true, 
              mode: newMode as 'login' | 'signup' | 'forgot' | 'otp',
              email: email || authModal.email 
            })
          }
        />
      )}

      {isAuthenticated && isVerified && (
        <Paper elevation={5} className="p-6 rounded-lg bg-white w-[800px] mt-10">
          <Typography variant="h5" component="h2" className="font-semibold mb-4">
            Todo List
          </Typography>
          
          <Box className="flex mb-4">
            <TextField
              variant="outlined"
              placeholder="Add new todo..."
              size="small"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              className="flex-1 mr-2"
            />
            <Button 
              variant="contained" 
              color="primary" 
              onClick={handleAddTodo}
              disabled={loading}
            >
              Add Todo
            </Button>
          </Box>

          {loading ? (
            <Box display="flex" justifyContent="center" p={3}>
              <CircularProgress />
            </Box>
          ) : (
            <div className="space-y-2">
              {items&&items?.map((todo: any) => (
                <Box 
                  key={todo.id} 
                  className={`flex items-center p-3 rounded ${
                    todo.completed ? 'bg-gray-50' : 'bg-white'
                  } border hover:shadow-md transition-shadow`}
                >
                  <Checkbox
                    checked={todo.completed}
                    onChange={() => handleUpdateTodo(todo)}
                    color="primary"
                  />
                  {editingTodo?.id === todo.id ? (
                    <TextField
                      value={editingTodo?.text}
                      onChange={(e) => setEditingTodo({ ...editingTodo, text: e.target.value })}
                      onBlur={() => handleEditTodo(todo.id, editingTodo?.text)}
                      onKeyPress={(e) => e.key === 'Enter' && handleEditTodo(todo.id, editingTodo?.text)}
                      className="flex-1 mx-2"
                      size="small"
                      autoFocus
                    />
                  ) : (
                    <Typography
                      className={`flex-1 mx-2 ${todo.completed ? 'text-gray-500 line-through' : ''}`}
                    >
                      {todo.todo}
                    </Typography>
                  )}
                  <Box className="flex space-x-1">
                    <IconButton
                      size="small"
                      onClick={() => setEditingTodo({ id: todo.id, text: todo.todo })}
                      className="text-blue-600"
                    >
                      <EditIcon fontSize="small" />
                    </IconButton>
                    <IconButton
                      size="small"
                      onClick={() => handleDeleteTodo(todo.id)}
                      className="text-red-600"
                    >
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </Box>
                </Box>
              ))}
            </div>
          )}
        </Paper>
      )}
    </div>
  )
}

export default TodoPage
