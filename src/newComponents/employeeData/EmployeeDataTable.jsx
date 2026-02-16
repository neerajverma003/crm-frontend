import React, { useState, useEffect } from "react";
import { Eye, Edit2, Trash2, UploadCloud } from "lucide-react";
import UploadDocumentsModal from "./UploadDocumentsModal";
import AddEmployeeDataModal from "./AddEmployeeDataModal";
import ViewEmployeeModal from "./ViewEmployeeModal";

const EmployeeDataTable = ({ searchText = "", refreshTrigger = 0, onRefresh }) => {
  const [employees, setEmployees] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [viewData, setViewData] = useState(null);
  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  const [uploadEmployeeId, setUploadEmployeeId] = useState(null);

  const itemsPerPage = 10;

  useEffect(() => {
    fetchEmployeeData();
  }, [currentPage, searchText, refreshTrigger]);

  const fetchEmployeeData = async () => {
    try {
      setIsLoading(true);
      const params = new URLSearchParams({
        page: currentPage,
        limit: itemsPerPage,
        ...(searchText && { search: searchText }),
      });

      const response = await fetch(
        `http://localhost:4000/employeedata/?${params.toString()}`
      );
      const result = await response.json();

      if (result.success) {
        setEmployees(result.data || []);
        setTotalPages(result.pagination?.totalPages || 0);
      }
    } catch (error) {
      console.error("Error fetching employee data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = async (employee) => {
    try {
      // Fetch complete employee data including all fields
      const response = await fetch(`http://localhost:4000/employeedata/${employee._id}`);
      const result = await response.json();
      
      if (result.success) {
        setSelectedEmployee(result.data);
        setIsModalOpen(true);
      } else {
        alert("Failed to load employee data");
      }
    } catch (error) {
      console.error("Error fetching employee data:", error);
      alert("Error loading employee data");
    }
  };

  const handleView = async (employee) => {
    try {
      // Fetch complete employee data for full details view
      const response = await fetch(`http://localhost:4000/employeedata/${employee._id}`);
      const result = await response.json();
      
      if (result.success) {
        setViewData(result.data);
        setViewModalOpen(true);
      } else {
        alert("Failed to load employee details");
      }
    } catch (error) {
      console.error("Error fetching employee details:", error);
      alert("Error loading employee details");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this employee?"))
      return;

    try {
      const response = await fetch(`http://localhost:4000/employeedata/${id}`, {
        method: "DELETE",
      });
      const result = await response.json();

      if (result.success) {
        setEmployees((prev) => prev.filter((emp) => emp._id !== id));
        onRefresh?.();
      } else {
        alert(result.message || "Failed to delete employee");
      }
    } catch (error) {
      console.error("Error deleting employee:", error);
      alert("Error deleting employee");
    }
  };

  const handleSave = () => {
    setIsModalOpen(false);
    setSelectedEmployee(null);
    fetchEmployeeData();
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-gray-500">Loading employee data...</div>
      </div>
    );
  }

  return (
    <>
      <div className="w-full overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-gradient-to-r from-blue-50 to-slate-50 border-b border-gray-200">
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wide">
                S. No
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wide">
                Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wide">
                Phone Number
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wide">
                Email
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wide">
                Present Address
              </th>
              <th className="px-6 py-3 text-center text-xs font-semibold text-gray-700 uppercase tracking-wide">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {employees.length === 0 ? (
              <tr>
                <td colSpan="6" className="px-6 py-12 text-center text-gray-500">
                  No employee data found
                </td>
              </tr>
            ) : (
              employees.map((employee, index) => (
                <tr
                  key={employee._id}
                  className="border-b border-gray-200 hover:bg-blue-50/50 transition-colors"
                >
                  <td className="px-6 py-4 text-sm text-gray-700">
                    {(currentPage - 1) * itemsPerPage + index + 1}
                  </td>
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">
                    {employee.employeeName}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-700">
                    {employee.employeePhoneNumber}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-700">
                    {employee.email}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-700 max-w-xs truncate">
                    {employee.presentAddress}
                  </td>
                  <td className="px-6 py-4 text-center">
                    <div className="flex items-center justify-center gap-2">
                      <button
                        onClick={() => handleView(employee)}
                        className="p-2 hover:bg-blue-100 rounded-lg transition-colors"
                        title="View"
                      >
                        <Eye className="w-4 h-4 text-blue-600" />
                      </button>
                      <button
                        onClick={() => {
                          setUploadEmployeeId(employee._id);
                          setUploadModalOpen(true);
                        }}
                        className="p-2 hover:bg-green-100 rounded-lg transition-colors"
                        title="Upload Documents"
                      >
                        <UploadCloud className="w-4 h-4 text-green-600" />
                      </button>
                      <button
                        onClick={() => handleEdit(employee)}
                        className="p-2 hover:bg-yellow-100 rounded-lg transition-colors"
                        title="Edit"
                      >
                        <Edit2 className="w-4 h-4 text-yellow-600" />
                      </button>
                      <button
                        onClick={() => handleDelete(employee._id)}
                        className="p-2 hover:bg-red-100 rounded-lg transition-colors"
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4 text-red-600" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between px-6 py-4 border-t border-gray-200 bg-gray-50">
          <div className="text-sm text-gray-600">
            Page {currentPage} of {totalPages}
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="px-3 py-1 bg-gray-200 text-gray-700 rounded disabled:opacity-50 hover:bg-gray-300"
            >
              Previous
            </button>
            <button
              onClick={() =>
                setCurrentPage((prev) => Math.min(prev + 1, totalPages))
              }
              disabled={currentPage === totalPages}
              className="px-3 py-1 bg-gray-200 text-gray-700 rounded disabled:opacity-50 hover:bg-gray-300"
            >
              Next
            </button>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {isModalOpen && (
        <AddEmployeeDataModal
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            setSelectedEmployee(null);
          }}
          onSave={handleSave}
          initialData={selectedEmployee}
        />
      )}

      {/* View Modal */}
      <ViewEmployeeModal 
        isOpen={viewModalOpen} 
        onClose={() => setViewModalOpen(false)} 
        data={viewData} 
      />

      {/* Upload Modal */}
      {uploadModalOpen && (
        <UploadDocumentsModal
          isOpen={uploadModalOpen}
          onClose={() => {
            setUploadModalOpen(false);
            setUploadEmployeeId(null);
          }}
          employeeId={uploadEmployeeId}
          onUploaded={() => {
            setUploadModalOpen(false);
            setUploadEmployeeId(null);
            fetchEmployeeData();
            onRefresh?.();
          }}
        />
      )}
    </>
  );
};

export default EmployeeDataTable;
