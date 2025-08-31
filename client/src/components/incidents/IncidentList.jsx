import React, { useEffect, useState } from 'react';
import { useApi } from '../../hooks/useApi';
import { incidentAPI } from '../../services/api';
import LoadingSpinner from '../common/LoadingSpinner';

const IncidentList = () => {
  const { loading, error, execute, data: incidents } = useApi();
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  useEffect(() => {
    execute(() => incidentAPI.getMyIncidents({ page: currentPage, limit: pageSize }));
  }, [execute, currentPage]);

  const handleNextPage = () => {
    if (incidents?.length === pageSize) {
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
      <h2 className="text-xl font-semibold mb-4">My Incidents</h2>
      {loading && <LoadingSpinner />}
      {error && <p className="text-red-500">{error}</p>}
      {incidents && incidents.length === 0 && (
        <p className="text-gray-500">No incidents reported.</p>
      )}
      {incidents && incidents.length > 0 && (
        <div className="space-y-4">
          {incidents.map((incident) => (
            <div key={incident._id} className="border p-4 rounded-lg">
              <h3 className="text-lg font-medium">{incident.title}</h3>
              <p className="text-gray-600">{incident.description}</p>
              <p>Status: {incident.status}</p>
              {incident.fileUrl && (
                <a href={incident.fileUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                  View File
                </a>
              )}
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
              disabled={incidents.length < pageSize}
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

export default IncidentList;