import React from "react";
import Input from "../components/Input";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../store/store";
import { authUser } from "../store/userSlice";
import { Link, useNavigate } from "react-router-dom";

export default function Login() {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const [formData, setFormData] = React.useState({
    email: "",
    password: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(authUser(formData))
      .unwrap()
      .then(() => navigate("/"));
  };

  const handleChange = (value: string | number, key: keyof typeof formData) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <div className="login">
      <form onSubmit={handleSubmit}>
        <Input
          id="login__email"
          label="E-mail address"
          type="email"
          onChange={(value) => handleChange(value, "email")}
        />
        <Input
          id="login__password"
          label="Password"
          type="password"
          onChange={(value) => handleChange(value, "password")}
        />
        <button type="submit">Login</button>
      </form>
      <Link className="url" to="/register">
        Don't have account yet? Register now.
      </Link>
    </div>
  );
}
