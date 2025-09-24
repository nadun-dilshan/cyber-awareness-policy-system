import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useApi } from "../../hooks/useApi";
import { policyAPI } from "../../services/api";
import { useAuth } from "../../context/AuthContext";
import LoadingSpinner from "../common/LoadingSpinner";

const PolicyList = () => {
  const { loading, error, execute, data: policies } = useApi();
  const { isAdmin } = useAuth();
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
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
      <h2 className="text-xl font-semibold mb-4">
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
            <div key={policy._id} className="border p-4 rounded-lg">
              <h3 className="text-lg font-medium">{policy.title}</h3>
              <p className="text-gray-600">{policy.description}</p>
              {policy.fileUrl && (
                <a
                  href={policy.fileUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline"
                >
                  View Document
                </a>
              )}
              <div className="flex flex-wrap items-center gap-2 mt-2">
                {!policy.acknowledged && (
                  <button
                    onClick={() => handleAcknowledge(policy._id)}
                    className="btn-primary"
                  >
                    Acknowledge
                  </button>
                )}
                {policy.acknowledged && (
                  <span className="text-green-600">Acknowledged</span>
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
    </div>
  );
};

export default PolicyList;
