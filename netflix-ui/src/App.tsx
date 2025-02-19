import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Netflix from "./pages/Netflix";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Netflix />,
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
