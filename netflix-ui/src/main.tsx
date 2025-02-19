import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { store } from './store/store.ts';
import Netflix from './pages/Netflix.tsx';
import Login from './pages/Login.tsx';
import Signup from './pages/Signup.tsx';
import './index.css';
import Play from './pages/Play.tsx';

const router = createBrowserRouter([
  { path: "/", element: <Netflix /> },
  { path: "/login", element: <Login /> },
  { path: "/signup", element: <Signup /> },
  { path: "/play", element: <Play /> },
]);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Provider store={store}>
      <RouterProvider router={router} />
    </Provider>
  </React.StrictMode>
);
