import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Netflix from "./pages/Netflix";
import AuthForm from "./pages/abc";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Netflix />,
  },
  {
    path: "/auth",
    element: <AuthForm />,
  },
]);

function App() {
  return (
    <>
      <RouterProvider router={router} />
    </>
  );
}

export default App;
