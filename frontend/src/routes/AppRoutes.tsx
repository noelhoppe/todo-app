import { Navigate, Route, Routes } from "react-router-dom";
import Login from "../pages/Login/Login";
import ProtectedRoute from "./ProtectedRoutes";
import Todo from "../pages/Todos/Todo";

function AppRoutes() {
  return (
    <Routes>
      {/* REDIRECT / => /login */}
      <Route path="/" element={<Navigate to="/login/" replace={true}/>} />
      {/* /login is public */}
      <Route path="/login/" element={<Login />} />
      {/* TODO: /register is also public */}
      <Route element={<ProtectedRoute />}>
        <Route path="/todos/" element={<Todo />} />
      </Route>
    </Routes>
  )
}

export default AppRoutes;