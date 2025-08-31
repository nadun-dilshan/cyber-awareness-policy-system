import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useApi } from '../../hooks/useApi';
import { trainingAPI } from '../../services/api';
import LoadingSpinner from '../common/LoadingSpinner';

const TrainingView = () => {
  const { trainingId } = useParams();
  const { loading, error, execute, data: training } = useApi();

  useEffect(() => {
    execute(() => trainingAPI.getTrainings()); // Assuming getTrainings fetches all; adjust if single endpoint exists
  }, [execute, trainingId]);

  const selectedTraining = training?.find(t => t._id === trainingId);

  return (
    <div className="card">
      <h2 className="text-xl font-semibold mb-4">Training View</h2>
      {loading && <LoadingSpinner />}
      {error && <p className="text-red-500">{error}</p>}
      {selectedTraining ? (
        <div>
          <h3 className="text-lg font-medium">{selectedTraining.title}</h3>
          <p>{selectedTraining.content}</p>
        </div>
      ) : (
        <p className="text-gray-500">Training not found.</p>
      )}
    </div>
  );
};

export default TrainingView;