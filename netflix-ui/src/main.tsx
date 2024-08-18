import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { createBrowserRouter, RouterProvider } from "react-router-dom"
import Netflix from './pages/Netflix.tsx'
import Login from './pages/Login.tsx'
import Signup from './pages/Signup.tsx'

const router = createBrowserRouter([
  {
    path: "/",
    element: <Netflix />
  },
  {
    path: "/login",
    element: <Login />
  },
  {
    path: "/signup",
    element: <Signup />
  },
])

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
    <RouterProvider router={router} />
  </React.StrictMode>,
)
