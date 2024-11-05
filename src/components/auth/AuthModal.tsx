"use client"
import React, { useState } from 'react'
import {
  Modal,
  Box,
  Typography,
  TextField,
  Button,
  IconButton,
  InputAdornment,
  Alert,
  CircularProgress,
  Link
} from '@mui/material'
import { Visibility, VisibilityOff } from '@mui/icons-material'
import { useDispatch } from 'react-redux'
import { signup, login, verifyOtp, forgotPassword, resetPassword } from '@/store/slices/authSlice'
import { AppDispatch } from '@/store/store'  // Add this import

const modalStyle = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  borderRadius: 2,
  boxShadow: 24,
  p: 4,
}

interface AuthModalProps {
  open: boolean
  onClose: () => void
  mode: 'login' | 'signup' | 'forgot' | 'otp' | 'resetPassword'
  email: string
  onModeChange: (mode: string, email?: string) => void
}

const AuthModal = ({ open, onClose, mode, email, onModeChange }: AuthModalProps) => {
  const dispatch = useDispatch<AppDispatch>()
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [formData, setFormData] = useState({
    email: email || '',
    password: '',
    confirmPassword: '',
    otp: '',
    newPassword: ''
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      if (mode === 'signup') {
        await dispatch(signup({ email: formData.email, password: formData.password })).unwrap()
        onModeChange('otp', formData.email)
      } else if (mode === 'login') {
        await dispatch(login({ email: formData.email, password: formData.password })).unwrap()
        onClose()
      } else if (mode === 'forgot') {
        await dispatch(forgotPassword({ email: formData.email })).unwrap()
        onModeChange('resetPassword', formData.email)
      } else if (mode === 'otp') {
        await dispatch(verifyOtp({ email: formData.email, otp: formData.otp })).unwrap()
        onClose()
      } else if (mode === 'resetPassword') {
        await dispatch(resetPassword({
          email: formData.email,
          otp: formData.otp,
          newPassword: formData.newPassword
        })).unwrap()
        onModeChange('login', formData.email)
      }
    } catch (err: any) {
      console.log(err);
      setError(err.error || 'Authentication failed')
    } finally {
      setLoading(false)
    }
  }
  const renderForm = () => {
    switch (mode) {
      case 'login':
        return (
          <>
            <Typography variant="h5" component="h2" textAlign="center" mb={3}>
              Login
            </Typography>
            <TextField
              fullWidth
              label="Email"
              type="email"
              margin="normal"
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
            />
            <TextField
              fullWidth
              label="Password"
              type={showPassword ? 'text' : 'password'}
              margin="normal"
              value={formData.password}
              onChange={(e) => setFormData({...formData, password: e.target.value})}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={() => setShowPassword(!showPassword)}>
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                )
              }}
            />
            <Link
              component="button"
              variant="body2"
              onClick={() => onModeChange('forgot')}
              sx={{ mt: 1, display: 'block' }}
            >
              Forgot Password?
            </Link>
            <Link
              component="button"
              variant="body2"
              onClick={() => onModeChange('signup')}
              sx={{ mt: 1, display: 'block' }}
            >
              Don't have an account? Sign Up
            </Link>
          </>
        )

      case 'signup':
        return (
          <>
            <Typography variant="h5" component="h2" textAlign="center" mb={3}>
              Sign Up
            </Typography>
            <TextField
              fullWidth
              label="Email"
              type="email"
              margin="normal"
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
            />
            <TextField
              fullWidth
              label="Password"
              type={showPassword ? 'text' : 'password'}
              margin="normal"
              value={formData.password}
              onChange={(e) => setFormData({...formData, password: e.target.value})}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={() => setShowPassword(!showPassword)}>
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                )
              }}
            />
            <Link
              component="button"
              type="button"
              variant="body2"
              onClick={(e) => {
                e.preventDefault()
                e.stopPropagation()
                onModeChange('login')
              }}
              sx={{ mt: 1, display: 'block' }}
            >
              Already have an account? Login
            </Link>
          </>
        )

      case 'forgot':
        return (
          <>
            <Typography variant="h5" component="h2" textAlign="center" mb={3}>
              Forgot Password
            </Typography>
            <TextField
              fullWidth
              label="Email"
              type="email"
              margin="normal"
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
            />
            <Link
              component="button"
              variant="body2"
              onClick={() => onModeChange('login')}
              sx={{ mt: 1, display: 'block' }}
            >
              Remember your password? Login
            </Link>
          </>
        )

      case 'otp':
        return (
          <>
            <Typography variant="h5" component="h2" textAlign="center" mb={3}>
              Verify OTP
            </Typography>
            <TextField
              fullWidth
              label="Enter OTP"
              margin="normal"
              value={formData.otp}
              onChange={(e) => setFormData({...formData, otp: e.target.value})}
            />
          </>
        )

      case 'resetPassword':
        return (
          <>
            <Typography variant="h5" component="h2" textAlign="center" mb={3}>
              Reset Password
            </Typography>
            <TextField
              fullWidth
              label="Enter OTP"
              margin="normal"
              value={formData.otp}
              onChange={(e) => setFormData({...formData, otp: e.target.value})}
            />
            <TextField
              fullWidth
              label="New Password"
              type={showPassword ? 'text' : 'password'}
              margin="normal"
              value={formData.newPassword}
              onChange={(e) => setFormData({...formData, newPassword: e.target.value})}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={() => setShowPassword(!showPassword)}>
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                )
              }}
            />
          </>
        )    }
  }

  return (
    <Modal 
      open={open} 
      onClose={(event, reason) => {
        if (reason !== 'backdropClick') {
          onClose();
        }
      }}
      disableEscapeKeyDown
      aria-labelledby="auth-modal-title" 
      aria-describedby="auth-modal-description"
    >
      <Box sx={modalStyle} component="form" onSubmit={handleSubmit}>
        {renderForm()}
        
        {error && (
          <Alert severity="error" sx={{ mt: 2 }}>
            {error}
          </Alert>
        )}

        <Button
          fullWidth
          variant="contained"
          type="submit"
          sx={{ mt: 3 }}
          disabled={loading}
        >
          {loading ? (
            <CircularProgress size={24} />
          ) : (
            mode === 'login' ? 'Login' :
            mode === 'signup' ? 'Sign Up' :
            mode === 'forgot' ? 'Send OTP' :
            'Verify OTP'
          )}
        </Button>
      </Box>
    </Modal>
  )
}

export default AuthModal
