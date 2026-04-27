import { createBrowserRouter } from 'react-router-dom'
import AppLayout from '../layouts/AppLayout'
import AuthLayout from '../layouts/AuthLayout'
import ProtectedRoute from '../components/ProtectedRoute'
import Learning from '../pages/Learning'
import Quiz from '../pages/Quiz'
import Profile from '../pages/Profile'
import Login from '../pages/Login'
import Register from '../pages/Register'

export const router = createBrowserRouter([
  {
    path: '/',
    element: <AppLayout />,
    children: [
      {
        element: <ProtectedRoute />,
        children: [
          { index: true, element: <Learning /> },
          { path: 'quiz', element: <Quiz /> },
          { path: 'profile', element: <Profile /> },
        ],
      },
    ],
  },
  {
    path: '/auth',
    element: <AuthLayout />,
    children: [
      { path: 'login', element: <Login /> },
      { path: 'register', element: <Register /> },
    ],
  },
])