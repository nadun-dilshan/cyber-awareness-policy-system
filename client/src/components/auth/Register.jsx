import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useApi } from "../../hooks/useApi";
import { authAPI } from "../../services/api";
import { ROUTES, DEPARTMENTS } from "../../utils/constants";
import {
  validateUsername,
  validatePassword,
  validateRequired,
  VALIDATION_MESSAGES,
} from "../../utils/validation";
import LoadingSpinner from "../common/LoadingSpinner";
import { useAuth } from "../../context/AuthContext";

const Register = () => {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    role: "employee",
    department: "",
  });
  const [fieldErrors, setFieldErrors] = useState({});
  const { loading, error, execute } = useApi();
  const navigate = useNavigate();
  const { isAdmin } = useAuth();

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
    } else if (!validateUsername(formData.username)) {
      errors.username = VALIDATION_MESSAGES.USERNAME_INVALID;
    }

    if (!validateRequired(formData.password)) {
      errors.password = VALIDATION_MESSAGES.REQUIRED;
    } else if (!validatePassword(formData.password)) {
      errors.password = VALIDATION_MESSAGES.PASSWORD_WEAK;
    }

    if (!validateRequired(formData.department)) {
      errors.department = VALIDATION_MESSAGES.REQUIRED;
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
      await execute(() => authAPI.register(formData));
      navigate(ROUTES.LOGIN);
    } catch (err) {
      console.error("Registration failed:", err);
    }
  };

  if (!isAdmin()) {
    return <div>Access denied. Admins only.</div>;
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="card w-full max-w-md">
        <h2 className="text-2xl font-bold text-center mb-6">
          Register New User
        </h2>
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
          <div className="mb-4">
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
          <div className="mb-4">
            <label className="form-label">Role</label>
            <select
              name="role"
              value={formData.role}
              onChange={handleChange}
              className="form-input"
              required
            >
              <option value="admin">Admin</option>
              <option value="employee">Employee</option>
            </select>
          </div>
          <div className="mb-6">
            <label className="form-label">Department</label>
            <select
              name="department"
              value={formData.department}
              onChange={handleChange}
              className={`form-input ${
                fieldErrors.department ? "border-red-500" : ""
              }`}
              required
            >
              <option value="">Select Department</option>
              {DEPARTMENTS.map((dept) => (
                <option key={dept} value={dept}>
                  {dept}
                </option>
              ))}
            </select>
            {fieldErrors.department && (
              <p className="text-red-500 text-sm mt-1">
                {fieldErrors.department}
              </p>
            )}
          </div>
          <button
            type="submit"
            className="btn-primary w-full"
            disabled={loading}
          >
            {loading ? <LoadingSpinner size="sm" /> : "Register"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Register;
