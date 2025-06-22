import { Navigate, Route, Routes } from "react-router-dom";
import Login from "../pages/Login/Login";
import ProtectedRoute from "./ProtectedRoutes";
import FilterableTodoTable from "../pages/ToDo/FilterableTodoTable";
import Register from "../pages/Register/Register";

export default function AppRoutes() {
  return (
    <Routes>
      {/* REDIRECT / => /login */}
      <Route path="/" element={<Navigate to="/login/" replace={true}/>} />
      <Route path="/register" element={<Register/>}/>
      {/* /login is public */}
      <Route path="/login/" element={<Login />} />
      {/* TODO: /register is also public */}
      <Route element={<ProtectedRoute />}>
        <Route path="/todos/" element={<FilterableTodoTable />} />
      </Route>
    </Routes>
  )
}