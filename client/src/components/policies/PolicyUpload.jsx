import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApi } from '../../hooks/useApi';
import { policyAPI } from '../../services/api';
import { DEPARTMENTS, ROUTES } from '../../utils/constants';
import LoadingSpinner from '../common/LoadingSpinner';

const PolicyUpload = () => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    assignedDepartments: [],
    file: null
  });
  const { loading, error, execute } = useApi();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (type === 'checkbox') {
      setFormData(prev => ({
        ...prev,
        assignedDepartments: checked
          ? [...prev.assignedDepartments, value]
          : prev.assignedDepartments.filter(d => d !== value)
      }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleFileChange = (e) => {
    setFormData(prev => ({ ...prev, file: e.target.files[0] }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();
    data.append('title', formData.title);
    data.append('description', formData.description);
    data.append('assignedDepartments', JSON.stringify(formData.assignedDepartments));
    if (formData.file) data.append('file', formData.file);

    try {
      await execute(() => policyAPI.uploadPolicy(data));
      navigate(ROUTES.POLICIES);
    } catch (err) {
      console.error('Policy upload failed:', err);
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
            className="form-input"
            required
          />
        </div>
        <div className="mb-4">
          <label className="form-label">Description</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            className="form-input h-32"
          />
        </div>
        <div className="mb-4">
          <label className="form-label">Assigned Departments</label>
          <div className="grid grid-cols-2 gap-2">
            {DEPARTMENTS.map(dept => (
              <div key={dept} className="flex items-center">
                <input
                  type="checkbox"
                  id={dept}
                  value={dept}
                  checked={formData.assignedDepartments.includes(dept)}
                  onChange={handleChange}
                  className="mr-2"
                />
                <label htmlFor={dept}>{dept}</label>
              </div>
            ))}
          </div>
        </div>
        {/* <div className="mb-4">
          <label className="form-label">Policy File</label>
          <input
            type="file"
            onChange={handleFileChange}
            className="form-input"
          />
        </div> */}
        <button type="submit" className="btn-primary w-full" disabled={loading}>
          {loading ? <LoadingSpinner size="sm" /> : 'Upload Policy'}
        </button>
      </form>
    </div>
  );
};

export default PolicyUpload;