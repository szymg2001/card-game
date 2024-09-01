import React from "react";
import Input from "../components/Input";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../store/store";
import { authUser } from "../store/userSlice";
import { Link, useNavigate } from "react-router-dom";

export default function Register() {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const [formData, setFormData] = React.useState({
    email: "",
    username: "",
    password: "",
    confirmPassword: "",
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
    <div className="register">
      <form onSubmit={handleSubmit}>
        <Input
          id="register__email"
          label="E-mail address"
          type="email"
          onChange={(value) => handleChange(value, "email")}
        />
        <Input
          id="register__username"
          label="Username"
          onChange={(value) => handleChange(value, "username")}
        />
        <Input
          id="register__password"
          label="Password"
          type="password"
          onChange={(value) => handleChange(value, "password")}
        />
        <Input
          id="register__confirmPassword"
          label="Confirm Password"
          type="password"
          onChange={(value) => handleChange(value, "confirmPassword")}
        />
        <button type="submit">Register</button>
      </form>
      <Link className="url" to="/login">
        Already have an account? Log in.
      </Link>
    </div>
  );
}
