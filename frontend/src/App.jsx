import Forget from "./components/Forget";
import Login from "./components/Login";
import Signin from "./components/Signin";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./index.css";

function App() {
  const router = createBrowserRouter([
    { path: "/", element: <Login /> },
    { path: "/signup", element: <Signin /> },
    { path: "/forget", element: <Forget /> },
  ]);
  return (
    <>
      <RouterProvider router={router} />
    </>
  );
}

export default App;
