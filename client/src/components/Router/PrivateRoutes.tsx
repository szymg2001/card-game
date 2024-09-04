import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import Cookie from "js-cookie";
import { useDispatch } from "react-redux";
import store, { AppDispatch } from "../../store/store";
import { jwtDecode } from "jwt-decode";
import { getUser } from "../../store/userSlice";

export default function PrivateRoutes() {
  const dispatch = useDispatch<AppDispatch>();
  const token = Cookie.get("token");

  React.useEffect(() => {
    if (token && !store.getState().user.data) {
      let decoded: { id: string } = jwtDecode(token);
      dispatch(getUser(decoded.id));
    }
  }, [token, dispatch]);

  return token ? <Outlet /> : <Navigate to="login" />;
}
