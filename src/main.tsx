import React from "react";
import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { store } from "./store/store.ts";
import Netflix from "./pages/Netflix.tsx";
import Login from "./pages/Login.tsx";
import Signup from "./pages/Signup.tsx";
import Play from "./pages/Play.tsx";
import Movies from "./pages/Movies.tsx";
import "./index.css";
import MyList from "./pages/MyList.tsx";
import NotFound from "./pages/NotFound.tsx";
import MovieDetails from "./pages/MovieDetails.tsx";

const router = createBrowserRouter([
  { path: "/", element: <Netflix /> },
  { path: "/movies", element: <Movies /> },
  { path: "/mylist", element: <MyList /> },
  {path:"/movie/:id", element: <MovieDetails />},
  { path: "*", element: <NotFound />},
  { path: "/play", element: <Play /> },
  { path: "/login", element: <Login /> },
  { path: "/signup", element: <Signup /> },
]);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <Provider store={store}>
      <RouterProvider router={router} />
    </Provider>
  </React.StrictMode>
);
