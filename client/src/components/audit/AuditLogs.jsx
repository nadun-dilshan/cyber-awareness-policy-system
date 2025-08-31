import React, { useEffect } from 'react';
import { useApi } from '../../hooks/useApi';
import { auditAPI } from '../../services/api';
import LoadingSpinner from '../common/LoadingSpinner';

const AuditLogs = () => {
  const { loading, error, execute, data: logs } = useApi();

  useEffect(() => {
    execute(() => auditAPI.getAuditLogs());
  }, [execute]);

  return (
    <div className="card">
      <h2 className="text-xl font-semibold mb-4">Audit Logs</h2>
      {loading && <LoadingSpinner />}
      {error && <p className="text-red-500">{error}</p>}
      {logs && logs.length === 0 && (
        <p className="text-gray-500">No audit logs available.</p>
      )}
      {logs && logs.length > 0 && (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Details</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Timestamp</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {logs.map((log) => (
                <tr key={log._id}>
                  <td className="px-6 py-4 whitespace-nowrap">{log.userId}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{log.action}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{log.details}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{new Date(log.timestamp).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AuditLogs;