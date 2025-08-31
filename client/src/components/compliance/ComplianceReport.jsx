import React, { useEffect } from 'react';
import { useApi } from '../../hooks/useApi';
import { complianceAPI } from '../../services/api';
import LoadingSpinner from '../common/LoadingSpinner';

const ComplianceReport = () => {
  const { loading, error, execute, data: report } = useApi();

  useEffect(() => {
    execute(() => complianceAPI.getComplianceReport());
  }, [execute]);

  return (
    <div className="card">
      <h2 className="text-xl font-semibold mb-4">Compliance Report</h2>
      {loading && <LoadingSpinner />}
      {error && <p className="text-red-500">{error}</p>}
      {report && report.length === 0 && (
        <p className="text-gray-500">No compliance data available.</p>
      )}
      {report && report.length > 0 && (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Username
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Policy Acks
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Quizzes Passed
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Compliant
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {report.map((user) => (
                <tr key={user.user}>
                  <td className="px-6 py-4 whitespace-nowrap">{user.user}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {user.acks}/{user.totalPolicies}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {user.quizzesPassed}/{user.totalTrainings}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 py-1 text-xs font-semibold rounded-full ${
                        user.compliant
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {user.compliant ? 'Compliant' : 'Non-compliant'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default ComplianceReport;