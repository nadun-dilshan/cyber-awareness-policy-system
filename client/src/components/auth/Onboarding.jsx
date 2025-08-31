import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useApi } from '../../hooks/useApi';
import { authAPI } from '../../services/api';
import { ROUTES } from '../../utils/constants';
import LoadingSpinner from '../common/LoadingSpinner';

const Onboarding = () => {
  const { loading, error, execute } = useApi();
  const navigate = useNavigate();

  const handleComplete = async () => {
    try {
      await execute(() => authAPI.completeOnboarding());
      navigate(ROUTES.DASHBOARD);
    } catch (err) {
      console.error('Onboarding completion failed:', err);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="card w-full max-w-md">
        <h2 className="text-2xl font-bold text-center mb-6">Complete Onboarding</h2>
        {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
        <p className="text-gray-600 mb-6">Welcome to ShieldUp! Click below to complete your onboarding.</p>
        <button onClick={handleComplete} className="btn-primary w-full" disabled={loading}>
          {loading ? <LoadingSpinner size="sm" /> : 'Complete Onboarding'}
        </button>
      </div>
    </div>
  );
};

export default Onboarding;