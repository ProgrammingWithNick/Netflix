import React from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Netflix from './pages/Netflix.tsx';
import Login from './pages/Login.tsx';
import Signup from './pages/Signup.tsx';
import './index.css';

const router = createBrowserRouter([
  {
    path: "/",
    element: <Netflix />, // Home page
  },
  {
    path: "/login",
    element: <Login />, // Login page
  },
  {
    path: "/signup",
    element: <Signup  />, // Signup page
  },
]);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
