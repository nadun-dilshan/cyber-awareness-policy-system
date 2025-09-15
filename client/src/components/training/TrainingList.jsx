import React, { useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';
import { useApi } from '../../hooks/useApi';
import { trainingAPI } from '../../services/api';
import LoadingSpinner from '../common/LoadingSpinner';
import { useAuth } from '../../context/AuthContext';

const TrainingList = () => {
  const { loading, error, execute, data: trainings } = useApi();
  const { isAdmin } = useAuth();
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;
  
  useEffect(() => {
    const endpoint = isAdmin() ? trainingAPI.getAllTrainings : trainingAPI.getTrainings;
    execute(() => endpoint({ page: currentPage, limit: pageSize }));
  }, [execute, currentPage, isAdmin]);

  const handleNextPage = () => {
    if (trainings?.length === pageSize) {
      setCurrentPage(prev => prev + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(prev => prev - 1);
    }
  };

  return (
    <div className="card">
      <h2 className="mb-4 text-xl font-semibold">Trainings</h2>
      {loading && <LoadingSpinner />}
      {error && <p className="text-red-500">{error}</p>}
      {trainings && trainings.length === 0 && (
        <p className="text-gray-500">No trainings assigned.</p>
      )}
      {trainings && trainings.length > 0 && (
        <div className="space-y-4">
          {trainings.map((training) => (
            <div key={training._id} className="p-4 border rounded-lg shadow-sm">
              <h3 className="mb-2 text-xl font-bold text-gray-800">
                {training.title || training.name || "Untitled Training"}
              </h3>
              {training.description && (
                <p className="mb-2 text-sm text-gray-600">{training.description}</p>
              )}
              <NavLink
                to={`/trainings/${training._id}`}
                className="mr-2 btn-primary"
              >
                View Training
              </NavLink>
              <NavLink
                to={`/trainings/quiz/${training._id}`}
                className="btn-secondary"
              >
                Take Quiz
              </NavLink>
            </div>
          ))}
          <div className="flex justify-between mt-4">
            <button
              onClick={handlePrevPage}
              disabled={currentPage === 1}
              className="btn-secondary disabled:opacity-50"
            >
              Previous
            </button>
            <span>Page {currentPage}</span>
            <button
              onClick={handleNextPage}
              disabled={trainings.length < pageSize}
              className="btn-secondary disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default TrainingList;
