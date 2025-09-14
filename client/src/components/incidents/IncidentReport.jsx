import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApi } from '../../hooks/useApi';
import { incidentAPI } from '../../services/api';
import { ROUTES } from '../../utils/constants';
import LoadingSpinner from '../common/LoadingSpinner';

const IncidentReport = () => {
  const [formData, setFormData] = useState({ title: '', description: '', file: null });
  const { loading, error, execute } = useApi();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    setFormData({ ...formData, file: e.target.files[0] });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();
    data.append('title', formData.title);
    data.append('description', formData.description);
    if (formData.file) data.append('file', formData.file);

    try {
      await execute(() => incidentAPI.submitIncident(data));
      navigate(ROUTES.INCIDENTS);
    } catch (err) {
      console.error('Incident submission failed:', err);
    }
  };

  return (
    <div className="max-w-md mx-auto card">
      <h2 className="mb-4 text-xl font-semibold">Report Incident</h2>
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
            className="h-32 form-input"
            required
          />
        </div>
        {/* <div className="mb-4">
          <label className="form-label">Attach File (optional)</label>
          <input
            type="file"
            onChange={handleFileChange}
            className="form-input"
          />
        </div> */}
        <button type="submit" className="w-full btn-primary" disabled={loading}>
          {loading ? <LoadingSpinner size="sm" /> : 'Submit Incident'}
        </button>
      </form>
    </div>
  );
};

export default IncidentReport;