import { Navigate, Route, Routes } from "react-router-dom";
import Login from "../pages/Login/Login";
import ProtectedRoute from "./ProtectedRoutes";
import FilterableTodoTable from "../pages/ToDo/FilterableToDoTable";
import Register from "../pages/Register/Register";

export default function AppRoutes() {
  return (
    <Routes>
      {/*     REDIRECT      / => /login     */}
      <Route path="/" element={<Navigate to="/login/" replace={true} />} />

      {/*     PUBLIC ROUTES     */}
      <Route path="/register/" element={<Register />} />
      <Route path="/login/" element={<Login />} />

      {/*     PROTECTED ROUTES  */}
      <Route element={<ProtectedRoute />}>
        <Route path="/todos/" element={<FilterableTodoTable />} />
      </Route>
    </Routes>
  );
}
