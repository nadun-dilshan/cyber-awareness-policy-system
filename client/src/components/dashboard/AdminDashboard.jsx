import React, { useEffect, useState } from "react";
import { useApi } from "../../hooks/useApi";
import {
  incidentAPI,
  complianceAPI,
  auditAPI,
  policyAPI,
} from "../../services/api";
import LoadingSpinner from "../common/LoadingSpinner";
import Modal from "../common/Modal";

const AdminDashboard = () => {
  const [showPolicyModal, setShowPolicyModal] = useState(false);
  const [selectedPolicy, setSelectedPolicy] = useState(null);

  const {
    loading: incidentsLoading,
    execute: executeIncidents,
    data: incidents,
    error: incidentsError,
  } = useApi();
  const {
    loading: complianceLoading,
    execute: executeCompliance,
    data: report,
    error: complianceError,
  } = useApi();
  const {
    loading: auditLoading,
    execute: executeAudit,
    data: logs,
    error: auditError,
  } = useApi();
  const {
    loading: policiesLoading,
    execute: executePolicies,
    data: policies,
    error: policiesError,
  } = useApi();
  const { loading: deleteLoading, execute: executeDelete } = useApi();

  useEffect(() => {
    executeIncidents(() => incidentAPI.getIncidents());
    executeCompliance(() => complianceAPI.getComplianceReport());
    executeAudit(() => auditAPI.getAuditLogs());
    executePolicies(() => policyAPI.getAllPolicies());
  }, [executeIncidents, executeCompliance, executeAudit, executePolicies]);

  const handleDeletePolicy = async (policyId) => {
    if (window.confirm("Are you sure you want to delete this policy?")) {
      try {
        await executeDelete(() => policyAPI.deletePolicy(policyId));
        // Refresh policies list
        executePolicies(() => policyAPI.getAllPolicies());
        setShowPolicyModal(false);
        setSelectedPolicy(null);
      } catch (error) {
        console.error("Error deleting policy:", error);
      }
    }
  };

  const handleViewPolicy = (policy) => {
    setSelectedPolicy(policy);
    setShowPolicyModal(true);
  };

  const pendingIncidents =
    incidents?.filter((i) => i.status === "new").length || 0;
  const nonCompliantUsers = report?.filter((u) => !u.compliant).length || 0;
  const recentLogs = logs?.slice(0, 5) || [];
  const activePolicies = policies?.length || 0;

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Admin Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="card">
          <h2 className="text-xl font-semibold mb-4">Active Policies</h2>
          {policiesLoading ? (
            <LoadingSpinner />
          ) : (
            <p className="text-4xl font-bold text-blue-600">{activePolicies}</p>
          )}
          {policiesError && <p className="text-red-500">{policiesError}</p>}
        </div>

        <div className="card">
          <h2 className="text-xl font-semibold mb-4">Pending Incidents</h2>
          {incidentsLoading ? (
            <LoadingSpinner />
          ) : (
            <p className="text-4xl font-bold text-yellow-600">
              {pendingIncidents}
            </p>
          )}
          {incidentsError && <p className="text-red-500">{incidentsError}</p>}
        </div>

        <div className="card">
          <h2 className="text-xl font-semibold mb-4">Non-Compliant Users</h2>
          {complianceLoading ? (
            <LoadingSpinner />
          ) : (
            <p className="text-4xl font-bold text-red-600">
              {nonCompliantUsers}
            </p>
          )}
          {complianceError && <p className="text-red-500">{complianceError}</p>}
        </div>

        <div className="card">
          <h2 className="text-xl font-semibold mb-4">Recent Audit Logs</h2>
          {auditLoading ? (
            <LoadingSpinner />
          ) : (
            <ul className="space-y-2">
              {recentLogs.map((log) => (
                <li key={log._id} className="text-sm">
                  {log.action} - {new Date(log.timestamp).toLocaleString()}
                </li>
              ))}
            </ul>
          )}
          {auditError && <p className="text-red-500">{auditError}</p>}
        </div>
      </div>

      {/* Policy Management Section */}
      <div className="card">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Policy Management</h2>
          <a href="/policies/upload" className="btn-primary">
            Upload New Policy
          </a>
        </div>

        {policiesLoading ? (
          <LoadingSpinner />
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full table-auto">
              <thead>
                <tr className="bg-gray-50">
                  <th className="px-4 py-2 text-left">Title</th>
                  <th className="px-4 py-2 text-left">Description</th>
                  <th className="px-4 py-2 text-left">Departments</th>
                  <th className="px-4 py-2 text-left">Roles</th>
                  <th className="px-4 py-2 text-left">File</th>
                  <th className="px-4 py-2 text-left">Created</th>
                  <th className="px-4 py-2 text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {policies?.map((policy) => (
                  <tr key={policy._id} className="border-t">
                    <td className="px-4 py-2 font-medium">{policy.title}</td>
                    <td className="px-4 py-2 text-sm text-gray-600">
                      {policy.description?.length > 50
                        ? `${policy.description.substring(0, 50)}...`
                        : policy.description}
                    </td>
                    <td className="px-4 py-2">
                      <div className="flex flex-wrap gap-1">
                        {policy.assignedDepartments?.map((dept) => (
                          <span
                            key={dept}
                            className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full"
                          >
                            {dept}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="px-4 py-2">
                      <div className="flex flex-wrap gap-1">
                        {policy.assignedRoles?.map((role) => (
                          <span
                            key={role}
                            className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full"
                          >
                            {role}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="px-4 py-2">
                      {policy.fileUrl ? (
                        <div className="text-sm">
                          <div className="font-medium">{policy.fileName}</div>
                          <div className="text-gray-500">
                            {policy.fileSize
                              ? `${(policy.fileSize / 1024 / 1024).toFixed(
                                  2
                                )}MB`
                              : ""}
                          </div>
                        </div>
                      ) : (
                        <span className="text-gray-400">No file</span>
                      )}
                    </td>
                    <td className="px-4 py-2 text-sm text-gray-600">
                      {new Date(policy.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-2">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleViewPolicy(policy)}
                          className="text-blue-600 hover:text-blue-800 text-sm"
                        >
                          View
                        </button>
                        <button
                          onClick={() => handleDeletePolicy(policy._id)}
                          className="text-red-600 hover:text-red-800 text-sm"
                          disabled={deleteLoading}
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {(!policies || policies.length === 0) && (
              <div className="text-center py-8 text-gray-500">
                No policies found. Upload your first policy to get started.
              </div>
            )}
          </div>
        )}

        {policiesError && <p className="text-red-500 mt-4">{policiesError}</p>}
      </div>

      {/* Policy Details Modal */}
      {showPolicyModal && selectedPolicy && (
        <Modal
          isOpen={showPolicyModal}
          onClose={() => {
            setShowPolicyModal(false);
            setSelectedPolicy(null);
          }}
          title="Policy Details"
        >
          <div className="space-y-4">
            <div>
              <h3 className="font-semibold text-lg">{selectedPolicy.title}</h3>
              <p className="text-gray-600 mt-2">{selectedPolicy.description}</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <h4 className="font-medium">Assigned Departments:</h4>
                <div className="flex flex-wrap gap-1 mt-1">
                  {selectedPolicy.assignedDepartments?.map((dept) => (
                    <span
                      key={dept}
                      className="px-2 py-1 bg-blue-100 text-blue-800 text-sm rounded-full"
                    >
                      {dept}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="font-medium">Assigned Roles:</h4>
                <div className="flex flex-wrap gap-1 mt-1">
                  {selectedPolicy.assignedRoles?.map((role) => (
                    <span
                      key={role}
                      className="px-2 py-1 bg-green-100 text-green-800 text-sm rounded-full"
                    >
                      {role}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {selectedPolicy.fileUrl && (
              <div>
                <h4 className="font-medium">Policy Document:</h4>
                <div className="mt-2 p-3 bg-gray-50 rounded">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium">
                        {selectedPolicy.fileName}
                      </div>
                      <div className="text-sm text-gray-500">
                        {selectedPolicy.fileSize
                          ? `${(selectedPolicy.fileSize / 1024 / 1024).toFixed(
                              2
                            )}MB`
                          : ""}{" "}
                        PDF
                      </div>
                    </div>
                    <a
                      href={`http://localhost:5001${selectedPolicy.fileUrl}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-secondary text-sm"
                    >
                      View PDF
                    </a>
                  </div>
                </div>
              </div>
            )}

            <div className="text-sm text-gray-500">
              <div>Version: {selectedPolicy.version}</div>
              <div>
                Created: {new Date(selectedPolicy.createdAt).toLocaleString()}
              </div>
              {selectedPolicy.updatedAt !== selectedPolicy.createdAt && (
                <div>
                  Updated: {new Date(selectedPolicy.updatedAt).toLocaleString()}
                </div>
              )}
            </div>

            <div className="flex justify-end space-x-2 pt-4">
              <button
                onClick={() => handleDeletePolicy(selectedPolicy._id)}
                className="btn-danger"
                disabled={deleteLoading}
              >
                {deleteLoading ? "Deleting..." : "Delete Policy"}
              </button>
              <button
                onClick={() => {
                  setShowPolicyModal(false);
                  setSelectedPolicy(null);
                }}
                className="btn-secondary"
              >
                Close
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default AdminDashboard;
