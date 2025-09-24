import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useApi } from "../../hooks/useApi";
import { policyAPI } from "../../services/api";
import { useAuth } from "../../context/AuthContext";
import LoadingSpinner from "../common/LoadingSpinner";
import Modal from "../common/Modal";

const PolicyList = () => {
  const { loading, error, execute, data: policies } = useApi();
  const { isAdmin, user } = useAuth();
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedPolicy, setSelectedPolicy] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const pageSize = 10;

  useEffect(() => {
    const endpoint = isAdmin()
      ? policyAPI.getAllPolicies
      : policyAPI.getPolicies;
    execute(() => endpoint({ page: currentPage, limit: pageSize }));
  }, [execute, currentPage, isAdmin]);

  const handleAcknowledge = (policyId) => {
    navigate(`/policies/acknowledge/${policyId}`);
  };

  const handleViewPolicy = async (policyId) => {
    try {
      const response = await policyAPI.getPolicy(policyId);
      setSelectedPolicy(response.data);
      setShowModal(true);
    } catch (error) {
      console.error("Error fetching policy details:", error);
    }
  };

  const handleNextPage = () => {
    if (policies?.length === pageSize) {
      setCurrentPage((prev) => prev + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage((prev) => prev - 1);
    }
  };

  const handleDelete = async (policyId, policyTitle) => {
    if (
      window.confirm(
        `Are you sure you want to delete the policy "${policyTitle}"? This action cannot be undone.`
      )
    ) {
      try {
        console.log("Attempting to delete policy with ID:", policyId);
        const response = await policyAPI.deletePolicy(policyId);
        console.log("Delete response:", response);
        alert("Policy deleted successfully!");
        // Refresh the policy list after successful deletion
        const endpoint = isAdmin()
          ? policyAPI.getAllPolicies
          : policyAPI.getPolicies;
        execute(() => endpoint({ page: currentPage, limit: pageSize }));
      } catch (err) {
        console.error("Error deleting policy:", err);
        console.error("Error details:", err.response?.data || err.message);
        alert(
          `Error deleting policy: ${err.response?.data?.msg || err.message}`
        );
      }
    }
  };

  return (
    <div className="card">
      <h2 className="mb-4 text-xl font-semibold">
        {isAdmin() ? "All Policies" : "My Policies"}
      </h2>
      {loading && <LoadingSpinner />}
      {error && <p className="text-red-500">{error}</p>}

      {policies && policies.length === 0 && (
        <p className="text-gray-500">No policies assigned.</p>
      )}
      {policies && policies.length > 0 && (
        <div className="space-y-4">
          {policies.map((policy) => (
            <div
              key={policy._id}
              className="p-4 transition-colors border rounded-lg hover:border-blue-300"
            >
              <div className="flex items-start justify-between mb-2">
                <h3 className="text-lg font-medium">{policy.title}</h3>
                <div className="flex gap-2">
                  {policy.assignedDepartments?.map((dept) => (
                    <span
                      key={dept}
                      className="px-2 py-1 text-xs text-blue-800 bg-blue-100 rounded-full"
                    >
                      {dept}
                    </span>
                  ))}
                  {policy.assignedRoles?.map((role) => (
                    <span
                      key={role}
                      className="px-2 py-1 text-xs text-green-800 bg-green-100 rounded-full"
                    >
                      {role}
                    </span>
                  ))}
                </div>
              </div>

              <p className="mb-3 text-gray-600">
                {policy.description?.length > 120
                  ? `${policy.description.substring(0, 120)}...`
                  : policy.description}
              </p>

              {policy.fileUrl && (
                <div className="flex items-center justify-between p-2 mb-3 rounded bg-gray-50">
                  <div className="flex items-center space-x-2">
                    <svg
                      className="w-5 h-5 text-red-600"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <div>
                      <div className="text-sm font-medium">
                        {policy.fileName || "Policy Document"}
                      </div>
                      <div className="text-xs text-gray-500">
                        {policy.fileSize
                          ? `${(policy.fileSize / 1024 / 1024).toFixed(2)}MB`
                          : ""}{" "}
                        PDF
                      </div>
                    </div>
                  </div>
                  <a
                    href={`http://localhost:5001${policy.fileUrl}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm font-medium text-blue-600 hover:text-blue-800"
                  >
                    View PDF
                  </a>
                </div>
              )}

              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-500">
                  <div>Version {policy.version}</div>
                  <div>
                    Created: {new Date(policy.createdAt).toLocaleDateString()}
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <button
                    onClick={() => handleViewPolicy(policy._id)}
                    className="text-sm btn-secondary"
                  >
                    View Details
                  </button>

                  {!policy.acknowledged && (
                    <button
                      onClick={() => handleAcknowledge(policy._id)}
                      className="text-sm btn-primary"
                    >
                      Acknowledge
                    </button>
                  )}

                  {policy.acknowledged && (
                    <span className="px-3 py-1 text-sm text-green-800 bg-green-100 rounded-full">
                      ✓ Acknowledged
                    </span>
                  )}

                  {isAdmin() && (
                    <button
                      onClick={() => handleDelete(policy._id, policy.title)}
                      className="px-3 py-1 text-sm text-white bg-red-600 rounded hover:bg-red-700"
                    >
                      Delete
                    </button>
                  )}
                </div>
              </div>
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
              disabled={policies.length < pageSize}
              className="btn-secondary disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </div>
      )}

      {/* Policy Details Modal */}
      {showModal && selectedPolicy && (
        <Modal
          isOpen={showModal}
          onClose={() => {
            setShowModal(false);
            setSelectedPolicy(null);
          }}
          title="Policy Details"
        >
          <div className="space-y-4">
            <div>
              <h3 className="mb-2 text-lg font-semibold">
                {selectedPolicy.title}
              </h3>
              <p className="text-gray-600">{selectedPolicy.description}</p>
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div>
                <h4 className="mb-2 font-medium">Assigned Departments:</h4>
                <div className="flex flex-wrap gap-1">
                  {selectedPolicy.assignedDepartments?.map((dept) => (
                    <span
                      key={dept}
                      className="px-2 py-1 text-sm text-blue-800 bg-blue-100 rounded-full"
                    >
                      {dept}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="mb-2 font-medium">Assigned Roles:</h4>
                <div className="flex flex-wrap gap-1">
                  {selectedPolicy.assignedRoles?.map((role) => (
                    <span
                      key={role}
                      className="px-2 py-1 text-sm text-green-800 bg-green-100 rounded-full"
                    >
                      {role}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {selectedPolicy.fileUrl && (
              <div>
                <h4 className="mb-2 font-medium">Policy Document:</h4>
                <div className="p-3 rounded bg-gray-50">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <svg
                        className="w-8 h-8 text-red-600"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z"
                          clipRule="evenodd"
                        />
                      </svg>
                      <div>
                        <div className="font-medium">
                          {selectedPolicy.fileName}
                        </div>
                        <div className="text-sm text-gray-500">
                          {selectedPolicy.fileSize
                            ? `${(
                                selectedPolicy.fileSize /
                                1024 /
                                1024
                              ).toFixed(2)}MB`
                            : ""}{" "}
                          PDF
                        </div>
                      </div>
                    </div>
                    <a
                      href={`http://localhost:5001${selectedPolicy.fileUrl}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm btn-primary"
                    >
                      Open PDF
                    </a>
                  </div>
                </div>
              </div>
            )}

            <div className="pt-4 border-t">
              <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
                <div>
                  <div className="font-medium">Version:</div>
                  <div>{selectedPolicy.version}</div>
                </div>
                <div>
                  <div className="font-medium">Created By:</div>
                  <div>{selectedPolicy.createdBy?.username || "Unknown"}</div>
                </div>
                <div>
                  <div className="font-medium">Created:</div>
                  <div>
                    {new Date(selectedPolicy.createdAt).toLocaleString()}
                  </div>
                </div>
                {selectedPolicy.updatedAt !== selectedPolicy.createdAt && (
                  <div>
                    <div className="font-medium">Last Updated:</div>
                    <div>
                      {new Date(selectedPolicy.updatedAt).toLocaleString()}
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="flex justify-end pt-4 space-x-2">
              {!selectedPolicy.acknowledged && (
                <button
                  onClick={() => {
                    handleAcknowledge(selectedPolicy._id);
                    setShowModal(false);
                  }}
                  className="btn-primary"
                >
                  Acknowledge Policy
                </button>
              )}
              <button
                onClick={() => {
                  setShowModal(false);
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

export default PolicyList;
