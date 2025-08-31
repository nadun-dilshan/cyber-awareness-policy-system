import React, { useEffect } from 'react';
import { useApi } from '../../hooks/useApi';
import { incidentAPI, complianceAPI, auditAPI } from '../../services/api';
import LoadingSpinner from '../common/LoadingSpinner';

const AdminDashboard = () => {
  const { loading: incidentsLoading, execute: executeIncidents, data: incidents, error: incidentsError } = useApi();
  const { loading: complianceLoading, execute: executeCompliance, data: report, error: complianceError } = useApi();
  const { loading: auditLoading, execute: executeAudit, data: logs, error: auditError } = useApi();

  useEffect(() => {
    executeIncidents(() => incidentAPI.getIncidents());
    executeCompliance(() => complianceAPI.getComplianceReport());
    executeAudit(() => auditAPI.getAuditLogs());
  }, [executeIncidents, executeCompliance, executeAudit]);

  const pendingIncidents = incidents?.filter(i => i.status === 'new').length || 0;
  const nonCompliantUsers = report?.filter(u => !u.compliant).length || 0;
  const recentLogs = logs?.slice(0, 5) || [];

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Admin Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="card">
          <h2 className="text-xl font-semibold mb-4">Pending Incidents</h2>
          {incidentsLoading ? <LoadingSpinner /> : <p className="text-4xl">{pendingIncidents}</p>}
          {incidentsError && <p className="text-red-500">{incidentsError}</p>}
        </div>
        
        <div className="card">
          <h2 className="text-xl font-semibold mb-4">Non-Compliant Users</h2>
          {complianceLoading ? <LoadingSpinner /> : <p className="text-4xl">{nonCompliantUsers}</p>}
          {complianceError && <p className="text-red-500">{complianceError}</p>}
        </div>
        
        <div className="card">
          <h2 className="text-xl font-semibold mb-4">Recent Audit Logs</h2>
          {auditLoading ? <LoadingSpinner /> : (
            <ul className="space-y-2">
              {recentLogs.map(log => (
                <li key={log._id} className="text-sm">{log.action} - {new Date(log.timestamp).toLocaleString()}</li>
              ))}
            </ul>
          )}
          {auditError && <p className="text-red-500">{auditError}</p>}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;