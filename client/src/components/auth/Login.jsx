import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useApi } from "../../hooks/useApi";
import { authAPI } from "../../services/api";
import { ROUTES } from "../../utils/constants";
import { validateRequired, VALIDATION_MESSAGES } from "../../utils/validation";
import LoadingSpinner from "../common/LoadingSpinner";

const Login = () => {
  const [formData, setFormData] = useState({ username: "", password: "" });
  const [fieldErrors, setFieldErrors] = useState({});
  const { login } = useAuth();
  const { loading, error, execute } = useApi();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    // Clear field error when user starts typing
    if (fieldErrors[name]) {
      setFieldErrors({ ...fieldErrors, [name]: "" });
    }
  };

  const validateForm = () => {
    const errors = {};

    if (!validateRequired(formData.username)) {
      errors.username = VALIDATION_MESSAGES.REQUIRED;
    }

    if (!validateRequired(formData.password)) {
      errors.password = VALIDATION_MESSAGES.REQUIRED;
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      const response = await execute(() => authAPI.login(formData));
      login(response.token, response.user);
      navigate(
        response.user.onboardingCompleted ? ROUTES.DASHBOARD : ROUTES.ONBOARDING
      );
    } catch (err) {
      console.error("Login failed:", err);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="card w-full max-w-md">
        <h2 className="text-2xl font-bold text-center mb-6">Login</h2>
        {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="form-label">Username</label>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              className={`form-input ${
                fieldErrors.username ? "border-red-500" : ""
              }`}
              required
            />
            {fieldErrors.username && (
              <p className="text-red-500 text-sm mt-1">
                {fieldErrors.username}
              </p>
            )}
          </div>
          <div className="mb-6">
            <label className="form-label">Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className={`form-input ${
                fieldErrors.password ? "border-red-500" : ""
              }`}
              required
            />
            {fieldErrors.password && (
              <p className="text-red-500 text-sm mt-1">
                {fieldErrors.password}
              </p>
            )}
          </div>
          <button
            type="submit"
            className="btn-primary w-full"
            disabled={loading}
          >
            {loading ? <LoadingSpinner size="sm" /> : "Login"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
