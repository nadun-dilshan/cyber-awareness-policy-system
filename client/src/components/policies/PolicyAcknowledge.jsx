import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useApi } from '../../hooks/useApi';
import { policyAPI } from '../../services/api';
import { ROUTES } from '../../utils/constants';
import LoadingSpinner from '../common/LoadingSpinner';

const PolicyAcknowledge = () => {
  const { policyId } = useParams();
  const [signature, setSignature] = useState('');
  const { loading, error, execute } = useApi();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await execute(() => policyAPI.acknowledgePolicy({ policyId, signature }));
      navigate(ROUTES.POLICIES);
    } catch (err) {
      console.error('Acknowledgment failed:', err);
    }
  };

  return (
    <div className="card max-w-md mx-auto">
      <h2 className="text-xl font-semibold mb-4">Acknowledge Policy</h2>
      {loading && <LoadingSpinner />}
      {error && <p className="text-red-500">{error}</p>}
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="form-label">Electronic Signature</label>
          <input
            type="text"
            value={signature}
            onChange={(e) => setSignature(e.target.value)}
            className="form-input"
            placeholder="Type your name to sign"
            required
          />
        </div>
        <button type="submit" className="btn-primary w-full" disabled={loading}>
          {loading ? <LoadingSpinner size="sm" /> : 'Acknowledge'}
        </button>
      </form>
    </div>
  );
};

export default PolicyAcknowledge;