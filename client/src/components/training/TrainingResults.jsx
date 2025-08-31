import React, { useEffect, useState } from 'react';
import { useApi } from '../../hooks/useApi';
import { trainingAPI } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import LoadingSpinner from '../common/LoadingSpinner';

const TrainingResults = () => {
  const { isAdmin } = useAuth();
  const { loading, error, execute, data: results } = useApi();
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 100;

  useEffect(() => {
    const endpoint = isAdmin() ? trainingAPI.getTrainingResults : trainingAPI.getMyTrainingResults;
    execute(() => endpoint({ page: currentPage, limit: pageSize }));
    console.log(results)
  }, [execute, currentPage, isAdmin]);

  const handleNextPage = () => {
    if (results?.length === pageSize) {
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
      <h2 className="mb-4 text-xl font-semibold">{isAdmin() ? 'Training Results' : 'My Training Results'}</h2>
      {loading && <LoadingSpinner />}
      {error && <p className="text-red-500">{error}</p>}
      {results && results.length === 0 && (
        <p className="text-gray-500">No training results available.</p>
      )}
      {results && results.length > 0 && (
        <div className="space-y-4">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  {isAdmin() && (
                    <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                      Username
                    </th>
                  )}
                  <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                    Training Title
                  </th>
                  <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                    Score
                  </th>
                  <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                    Status
                  </th>
                  <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                    Completed At
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {results.map((result) => (
                  <tr key={result._id}>
                    {isAdmin() && (
                      <td className="px-6 py-4 whitespace-nowrap">{result.user.username}</td>
                    )}
                    <td className="px-6 py-4 whitespace-nowrap">{result.training.title}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{result.score}%</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 py-1 text-xs font-semibold rounded-full ${
                          result.passed ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {result.passed ? 'Passed' : 'Failed'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {result.completedAt ? new Date(result.completedAt).toLocaleString() : 'N/A'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
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
              disabled={results.length < pageSize}
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

export default TrainingResults;