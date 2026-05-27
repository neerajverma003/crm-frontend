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
        `${import.meta.env.VITE_API_URL}/employeedata/?${params.toString()}`
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
      const response = await fetch(`${import.meta.env.VITE_API_URL}/employeedata/${employee._id}`);
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
      const response = await fetch(`${import.meta.env.VITE_API_URL}/employeedata/${employee._id}`);
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
      const response = await fetch(`${import.meta.env.VITE_API_URL}/employeedata/${id}`, {
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
      {/* Desktop View: Table */}
      <div className="hidden md:block w-full overflow-x-auto">
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

      {/* Mobile View: Card Layout */}
      <div className="block md:hidden space-y-4 p-4">
        {employees.length === 0 ? (
          <div className="text-center py-12 text-gray-500 bg-white rounded-2xl border border-gray-100 shadow-sm">
            No employee data found
          </div>
        ) : (
          employees.map((employee, index) => (
            <div
              key={employee._id}
              className="bg-white rounded-2xl border border-gray-150 p-5 shadow-sm hover:shadow-md transition-all duration-200 flex flex-col gap-3 relative overflow-hidden"
            >
              {/* Badge for S.No */}
              <div className="absolute top-4 right-4 bg-blue-50 text-blue-700 font-bold text-xs px-2.5 py-1 rounded-full">
                # {(currentPage - 1) * itemsPerPage + index + 1}
              </div>

              {/* Profile Header */}
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-blue-500 text-white flex items-center justify-center font-bold text-lg shadow-sm">
                  {employee.employeeName ? employee.employeeName.charAt(0).toUpperCase() : "E"}
                </div>
                <div>
                  <h4 className="font-bold text-gray-900 text-base leading-tight">
                    {employee.employeeName}
                  </h4>
                  <p className="text-xs text-gray-500 mt-0.5 font-medium">Employee Profile</p>
                </div>
              </div>

              {/* Information List */}
              <div className="space-y-2 border-t border-gray-100 pt-3 text-sm">
                {employee.employeePhoneNumber && (
                  <div className="flex justify-between items-center gap-2">
                    <span className="text-gray-500 font-medium">Phone:</span>
                    <span className="text-gray-900 font-semibold">{employee.employeePhoneNumber}</span>
                  </div>
                )}
                {employee.email && (
                  <div className="flex justify-between items-center gap-2">
                    <span className="text-gray-500 font-medium">Email:</span>
                    <span className="text-gray-900 font-semibold break-all text-right">{employee.email}</span>
                  </div>
                )}
                {employee.presentAddress && (
                  <div className="flex flex-col gap-1 border-t border-gray-50 pt-2">
                    <span className="text-gray-500 font-medium">Address:</span>
                    <span className="text-gray-700 text-xs leading-relaxed">{employee.presentAddress}</span>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-2 border-t border-gray-100 pt-3 mt-1">
                <button
                  onClick={() => handleView(employee)}
                  className="flex items-center justify-center gap-1 px-3 py-2 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-xl transition-all font-semibold text-xs border border-blue-100"
                  title="View"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>View</span>
                </button>
                <button
                  onClick={() => {
                    setUploadEmployeeId(employee._id);
                    setUploadModalOpen(true);
                  }}
                  className="flex items-center justify-center gap-1 px-3 py-2 bg-green-50 hover:bg-green-100 text-green-700 rounded-xl transition-all font-semibold text-xs border border-green-100"
                  title="Upload Documents"
                >
                  <UploadCloud className="w-3.5 h-3.5" />
                  <span>Docs</span>
                </button>
                <button
                  onClick={() => handleEdit(employee)}
                  className="flex items-center justify-center gap-1 px-3 py-2 bg-yellow-50 hover:bg-yellow-100 text-yellow-700 rounded-xl transition-all font-semibold text-xs border border-yellow-100"
                  title="Edit"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                  <span>Edit</span>
                </button>
                <button
                  onClick={() => handleDelete(employee._id)}
                  className="flex items-center justify-center gap-1 px-3 py-2 bg-red-50 hover:bg-red-100 text-red-700 rounded-xl transition-all font-semibold text-xs border border-red-100"
                  title="Delete"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Delete</span>
                </button>
              </div>
            </div>
          ))
        )}
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
