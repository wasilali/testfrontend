"use client"
import React, { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Box, Typography, TextField, Button, IconButton, Paper, AppBar, Toolbar } from '@mui/material'
import DeleteIcon from '@mui/icons-material/Delete'
import LogoutIcon from '@mui/icons-material/Logout'
import AuthModal from '@/components/auth/AuthModal'
import { logout } from '@/store/slices/authSlice'
import { AppDispatch } from '@/store/store'
interface TodoItem {
  id: string
  text: string
  priority: number
}
const TodoPage = () => {
  const { isAuthenticated, isVerified, user } = useSelector((state: any) => state.auth)
  const dispatch = useDispatch<AppDispatch>()
  const [authModal, setAuthModal] = useState({
    open: true,
    mode: 'signup' as 'login' | 'signup' | 'forgot' | 'otp',
    email: ''
  })

  const [items, setItems] = useState<TodoItem[]>([])
  const [inputText, setInputText] = useState('')
  const [priority, setPriority] = useState('')

  const handleLogout = () => {
    dispatch(logout())
  }

  useEffect(() => {
    if (!isAuthenticated) {
      setAuthModal({ open: true, mode: 'signup', email: '' })
    } else if (!isVerified) {
      setAuthModal({ open: true, mode: 'otp', email: authModal.email })
    } else {
      setAuthModal({ ...authModal, open: false })
    }
  }, [isAuthenticated, isVerified])

  const handleAddItem = () => {
    if (inputText && priority) {
      setItems([...items, { id: Math.random().toString(), text: inputText, priority: Number(priority) }])
      setInputText('')
      setPriority('')
    }
  }

  const handleDelete = (id: string) => {
    setItems(items.filter(item => item.id !== id))
  }

  return (
    <div className="flex items-center flex-col min-h-screen bg-black">
            {isAuthenticated && isVerified && (
        <AppBar position="static" className="bg-gray-800">
          <Toolbar>
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
              {user?.email}
            </Typography>
            <IconButton color="inherit" onClick={handleLogout}>
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
        <Paper elevation={5} className="p-6 rounded-lg bg-gradient-to-b from-gray-800 to-gray-600 w-80 mt-10">
          <Typography variant="h5" component="h2" className="text-white font-semibold mb-4">
            Todo List
          </Typography>
          
          <Box className="flex mb-4">
            <TextField
              variant="outlined"
              placeholder="Title..."
              size="small"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              className="flex-1 bg-white rounded mr-2"
            />
            <TextField
              variant="outlined"
              placeholder="Priority"
              size="small"
              value={priority}
              onChange={(e) => setPriority(e.target.value)}
              className="w-20 bg-white rounded mr-2"
            />
            <Button variant="contained" color="warning" onClick={handleAddItem}>
              Add
            </Button>
          </Box>
  
          {items.map((item) => (
            <Box key={item.id} display="flex" alignItems="center" justifyContent="space-between" className="mb-2">
              <Typography variant="body1" className="text-yellow-500 font-bold mr-2">
                {item.priority}
              </Typography>
              <Typography variant="body1" className="text-white flex-1">
                {item.text}
              </Typography>
              <IconButton onClick={() => handleDelete(item.id)} className="text-yellow-500">
                <DeleteIcon />
              </IconButton>
            </Box>
          ))}
        </Paper>
      )}
    </div>
  )
}

export default TodoPage
