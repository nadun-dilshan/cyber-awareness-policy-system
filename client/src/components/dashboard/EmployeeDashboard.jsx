import React, { useEffect } from 'react';
import { useApi } from '../../hooks/useApi';
import { policyAPI, trainingAPI, incidentAPI, notificationAPI } from '../../services/api';
import LoadingSpinner from '../common/LoadingSpinner';

const EmployeeDashboard = () => {
  const { loading: policiesLoading, execute: executePolicies, data: policies, error: policiesError } = useApi();
  const { loading: trainingsLoading, execute: executeTrainings, data: trainings, error: trainingsError } = useApi();
  const { loading: incidentsLoading, execute: executeIncidents, data: incidents, error: incidentsError } = useApi();
  const { loading: notificationsLoading, execute: executeNotifications, data: notifications, error: notificationsError } = useApi();

  useEffect(() => {
    executePolicies(() => policyAPI.getPolicies());
    executeTrainings(() => trainingAPI.getTrainings());
    executeIncidents(() => incidentAPI.getMyIncidents());
    executeNotifications(() => notificationAPI.getNotifications());
  }, [executePolicies, executeTrainings, executeIncidents, executeNotifications]);

  const pendingPolicies = policies?.length || 0;
  const pendingTrainings = trainings?.length || 0;
  const openIncidents = incidents?.filter(i => i.status !== 'resolved').length || 0;
  const unreadNotifications = notifications?.filter(n => !n.read).length || 0;

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Employee Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="card">
          <h2 className="text-xl font-semibold mb-4">Pending Policies</h2>
          {policiesLoading ? <LoadingSpinner /> : <p className="text-4xl">{pendingPolicies}</p>}
          {policiesError && <p className="text-red-500">{policiesError}</p>}
        </div>
        
        <div className="card">
          <h2 className="text-xl font-semibold mb-4">Pending Trainings</h2>
          {trainingsLoading ? <LoadingSpinner /> : <p className="text-4xl">{pendingTrainings}</p>}
          {trainingsError && <p className="text-red-500">{trainingsError}</p>}
        </div>
        
        <div className="card">
          <h2 className="text-xl font-semibold mb-4">Open Incidents</h2>
          {incidentsLoading ? <LoadingSpinner /> : <p className="text-4xl">{openIncidents}</p>}
          {incidentsError && <p className="text-red-500">{incidentsError}</p>}
        </div>
        
        <div className="card">
          <h2 className="text-xl font-semibold mb-4">Unread Notifications</h2>
          {notificationsLoading ? <LoadingSpinner /> : <p className="text-4xl">{unreadNotifications}</p>}
          {notificationsError && <p className="text-red-500">{notificationsError}</p>}
        </div>
      </div>
    </div>
  );
};

export default EmployeeDashboard;