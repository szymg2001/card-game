import { BrowserRouter, Route, Routes } from "react-router-dom";
import Login from "../../pages/Login";
import Register from "../../pages/Register";
import PrivateRoutes from "./PrivateRoutes";

export default function RouterComponent() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route element={<PrivateRoutes />}>
          <Route path="/" element={<h1>homepage</h1>} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
