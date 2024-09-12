import { BrowserRouter, Route, Routes } from "react-router-dom";
import Login from "../../pages/Login";
import Register from "../../pages/Register";
import PrivateRoutes from "./PrivateRoutes";
import Game from "../../pages/Game";
import Homepage from "../../pages/Homepage";

export default function RouterComponent() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route element={<PrivateRoutes />}>
          <Route path="/" element={<Homepage />} />
          <Route path="/game/:id" element={<Game />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
