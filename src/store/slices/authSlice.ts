import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import axios from 'axios'

const API_URL = process.env.NEXT_PUBLIC_API_URL || ""
console.log(API_URL, process.env.NEXT_PUBLIC_API_URL);
const loadState = () => {
  try {
    const serializedState = localStorage.getItem('authState')
    return serializedState ? JSON.parse(serializedState) : {
      user: null,
      token: null,
      loading: false,
      error: null,
      isAuthenticated: false,
      isVerified: false,
    }
  } catch (err) {
    return {
      user: null,
      token: null,
      loading: false,
      error: null,
      isAuthenticated: false,
      isVerified: false,
    }
  }
}

export const signup = createAsyncThunk(
  'auth/signup',
  async (credentials: { email: string; password: string }) => {
    const response = await axios.post(`${API_URL}/signup`, credentials)
    return response.data
  }
)

export const verifyOtp = createAsyncThunk(
  'auth/verifyOtp',
  async (data: { email: string; otp: string }) => {
    const response = await axios.post(`${API_URL}/verify-otp`, data)
    localStorage.setItem('authState', JSON.stringify({
      user: response.data.user,
      token: response.data.token,
      isAuthenticated: true,
      isVerified: true
    }))
    return response.data
  }
)

export const login = createAsyncThunk(
  'auth/login',
  async (credentials: { email: string; password: string }) => {
    const response = await axios.post(`${API_URL}/login`, credentials)
    localStorage.setItem('authState', JSON.stringify({
      user: response.data.user,
      token: response.data.token,
      isAuthenticated: true,
      isVerified: true
    }))
    return response.data
  }
)

export const logout = createAsyncThunk(
  'auth/logout',
  async () => {
    const response = await axios.post(`${API_URL}/logout`)
    localStorage.removeItem('authState')
    return response.data
  }
)

export const forgotPassword = createAsyncThunk(
  'auth/forgotPassword',
  async (data: { email: string }) => {
    const response = await axios.post(`${API_URL}/forgot-password`, data)
    return response.data
  }
)

export const resetPassword = createAsyncThunk(
  'auth/resetPassword',
  async (data: { email: string; otp: string; newPassword: string }) => {
    const response = await axios.post(`${API_URL}/reset-password`, data)
    return response.data
  }
)

const authSlice = createSlice({
  name: 'auth',
  initialState: loadState(),
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(signup.fulfilled, (state, action) => {
        state.loading = false
        state.isAuthenticated = true
        state.isVerified = false
      })
      .addCase(verifyOtp.fulfilled, (state, action) => {
        state.loading = false
        state.isVerified = true
        state.user = action.payload.user
        state.token = action.payload.token
      })
      .addCase(login.fulfilled, (state, action) => {
        state.user = action.payload.user
        state.token = action.payload.token
        state.isAuthenticated = true
        state.isVerified = true
        state.loading = false
      })
      .addCase(logout.fulfilled, (state) => {
        state.user = null
        state.token = null
        state.isAuthenticated = false
        state.isVerified = false
        state.loading = false
      })
      .addMatcher(
        (action) => action.type.endsWith('/pending'),
        (state) => {
          state.loading = true
          state.error = null
        }
      )
      .addMatcher(
        (action) => action.type.endsWith('/rejected'),
        (state, action: any) => {
          state.loading = false
          state.error = action.payload?.message || action.error?.message || 'An error occurred'
        }
      )
  },
})

export default authSlice.reducer