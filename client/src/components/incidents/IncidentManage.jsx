import React, { useEffect, useState } from 'react';
import { useApi } from '../../hooks/useApi';
import { incidentAPI } from '../../services/api';
import LoadingSpinner from '../common/LoadingSpinner';

const IncidentManage = () => {
  const { loading, error, execute: fetchIncidents, data: incidents } = useApi();
  const { execute: updateStatus } = useApi();
  const [statusUpdates, setStatusUpdates] = useState({});

  useEffect(() => {
    fetchIncidents(() => incidentAPI.getIncidents());
  }, [fetchIncidents]);

  const handleStatusChange = (id, status) => {
    setStatusUpdates(prev => ({ ...prev, [id]: status }));
  };

  const handleUpdate = async (id) => {
    const status = statusUpdates[id];
    if (status) {
      try {
        await updateStatus(() => incidentAPI.updateIncidentStatus({ id, status }));
        fetchIncidents(() => incidentAPI.getIncidents()); // Refresh list
      } catch (err) {
        console.error('Status update failed:', err);
      }
    }
  };

  return (
    <div className="card">
      <h2 className="text-xl font-semibold mb-4">Manage Incidents</h2>
      {loading && <LoadingSpinner />}
      {error && <p className="text-red-500">{error}</p>}
      {incidents && incidents.length > 0 && (
        <div className="space-y-4">
          {incidents.map((incident) => (
            <div key={incident._id} className="border p-4 rounded-lg">
              <h3 className="text-lg font-medium">{incident.title}</h3>
              <p className="text-gray-600">{incident.description}</p>
              <p>Current Status: {incident.status}</p>
              {incident.fileUrl && (
                <a href={incident.fileUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                  View File
                </a>
              )}
              <select
                value={statusUpdates[incident._id] || incident.status}
                onChange={(e) => handleStatusChange(incident._id, e.target.value)}
                className="form-input mt-2"
              >
                <option value="new">New</option>
                <option value="in-review">In Review</option>
                <option value="resolved">Resolved</option>
              </select>
              <button onClick={() => handleUpdate(incident._id)} className="btn-primary mt-2 ml-2">
                Update Status
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default IncidentManage;