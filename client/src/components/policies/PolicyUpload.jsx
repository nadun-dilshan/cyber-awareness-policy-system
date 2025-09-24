import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useApi } from "../../hooks/useApi";
import { policyAPI } from "../../services/api";
import { DEPARTMENTS, ROUTES } from "../../utils/constants";
import {
  validatePolicyTitle,
  validatePolicyDescription,
  validateFileType,
  validateFileSize,
  validateArrayNotEmpty,
  VALIDATION_MESSAGES,
} from "../../utils/validation";
import LoadingSpinner from "../common/LoadingSpinner";

const PolicyUpload = () => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    assignedDepartments: [],
    assignedRoles: [],
    file: null,
  });
  const [fieldErrors, setFieldErrors] = useState({});
  const { loading, error, execute } = useApi();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (type === "checkbox") {
      if (name === "assignedDepartments") {
        setFormData((prev) => ({
          ...prev,
          assignedDepartments: checked
            ? [...prev.assignedDepartments, value]
            : prev.assignedDepartments.filter((d) => d !== value),
        }));
      } else if (name === "assignedRoles") {
        setFormData((prev) => ({
          ...prev,
          assignedRoles: checked
            ? [...prev.assignedRoles, value]
            : prev.assignedRoles.filter((r) => r !== value),
        }));
      }
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }

    // Clear field error when user starts typing/selecting
    if (fieldErrors[name]) {
      setFieldErrors({ ...fieldErrors, [name]: "" });
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setFormData((prev) => ({ ...prev, file }));

    // Clear file error when user selects a file
    if (fieldErrors.file) {
      setFieldErrors({ ...fieldErrors, file: "" });
    }
  };

  const validateForm = () => {
    const errors = {};

    if (!validatePolicyTitle(formData.title)) {
      errors.title = VALIDATION_MESSAGES.TITLE_INVALID;
    }

    if (!validatePolicyDescription(formData.description)) {
      errors.description = VALIDATION_MESSAGES.DESCRIPTION_INVALID;
    }

    if (!validateArrayNotEmpty(formData.assignedDepartments)) {
      errors.assignedDepartments = VALIDATION_MESSAGES.DEPARTMENTS_REQUIRED;
    }

    if (formData.file) {
      if (!validateFileType(formData.file, ["application/pdf"])) {
        errors.file = VALIDATION_MESSAGES.FILE_TYPE_INVALID;
      } else if (!validateFileSize(formData.file, 10)) {
        errors.file = VALIDATION_MESSAGES.FILE_SIZE_INVALID;
      }
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    const data = new FormData();
    data.append("title", formData.title);
    data.append("description", formData.description);
    data.append(
      "assignedDepartments",
      JSON.stringify(formData.assignedDepartments)
    );
    data.append("assignedRoles", JSON.stringify(formData.assignedRoles));
    if (formData.file) data.append("file", formData.file);

    try {
      await execute(() => policyAPI.uploadPolicy(data));
      navigate(ROUTES.POLICIES);
    } catch (err) {
      console.error("Policy upload failed:", err);
    }
  };

  return (
    <div className="card max-w-2xl mx-auto">
      <h2 className="text-xl font-semibold mb-4">Upload Policy</h2>
      {error && <p className="text-red-500">{error}</p>}
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="form-label">Title</label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            className={`form-input ${
              fieldErrors.title ? "border-red-500" : ""
            }`}
            placeholder="Enter policy title (5-100 characters)"
            required
          />
          {fieldErrors.title && (
            <p className="text-red-500 text-sm mt-1">{fieldErrors.title}</p>
          )}
        </div>
        <div className="mb-4">
          <label className="form-label">Description</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            className={`form-input h-32 ${
              fieldErrors.description ? "border-red-500" : ""
            }`}
            placeholder="Enter policy description (10-500 characters)"
            required
          />
          {fieldErrors.description && (
            <p className="text-red-500 text-sm mt-1">
              {fieldErrors.description}
            </p>
          )}
        </div>
        <div className="mb-4">
          <label className="form-label">Assigned Departments</label>
          <div className="grid grid-cols-2 gap-2">
            {DEPARTMENTS.map((dept) => (
              <div key={dept} className="flex items-center">
                <input
                  type="checkbox"
                  id={dept}
                  name="assignedDepartments"
                  value={dept}
                  checked={formData.assignedDepartments.includes(dept)}
                  onChange={handleChange}
                  className="mr-2"
                />
                <label htmlFor={dept} className="capitalize">
                  {dept}
                </label>
              </div>
            ))}
          </div>
          {fieldErrors.assignedDepartments && (
            <p className="text-red-500 text-sm mt-1">
              {fieldErrors.assignedDepartments}
            </p>
          )}
        </div>
        <div className="mb-4">
          <label className="form-label">Assigned Roles</label>
          <div className="grid grid-cols-2 gap-2">
            <div className="flex items-center">
              <input
                type="checkbox"
                id="admin"
                name="assignedRoles"
                value="admin"
                checked={formData.assignedRoles.includes("admin")}
                onChange={handleChange}
                className="mr-2"
              />
              <label htmlFor="admin">Admin</label>
            </div>
            <div className="flex items-center">
              <input
                type="checkbox"
                id="employee"
                name="assignedRoles"
                value="employee"
                checked={formData.assignedRoles.includes("employee")}
                onChange={handleChange}
                className="mr-2"
              />
              <label htmlFor="employee">Employee</label>
            </div>
          </div>
        </div>
        <div className="mb-4">
          <label className="form-label">Policy File (PDF)</label>
          <input
            type="file"
            accept=".pdf"
            onChange={handleFileChange}
            className={`form-input ${fieldErrors.file ? "border-red-500" : ""}`}
          />
          <p className="text-gray-500 text-sm mt-1">
            Only PDF files up to 10MB are allowed
          </p>
          {fieldErrors.file && (
            <p className="text-red-500 text-sm mt-1">{fieldErrors.file}</p>
          )}
          {formData.file && (
            <p className="text-green-600 text-sm mt-1">
              Selected: {formData.file.name} (
              {(formData.file.size / 1024 / 1024).toFixed(2)}MB)
            </p>
          )}
        </div>
        <button type="submit" className="btn-primary w-full" disabled={loading}>
          {loading ? <LoadingSpinner size="sm" /> : "Upload Policy"}
        </button>
      </form>
    </div>
  );
};

export default PolicyUpload;
