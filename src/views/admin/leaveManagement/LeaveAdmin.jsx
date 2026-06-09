import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { Check, X } from "lucide-react";
import { FaEye } from "react-icons/fa";
import { LeavePage } from "../../employee/LeaveSection/LeavePage";

export const LeaveAdmin = () => {
  const [leaves, setLeaves] = useState([]);
  const [employeeDetails, setEmployeeDetails] = useState({});
  const [companyDetails, setCompanyDetails] = useState({});
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);

  const [selectedCompany, setSelectedCompany] = useState("");
  const [selectedDepartment, setSelectedDepartment] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");

  const [showModal, setShowModal] = useState(false);
  const [selectedLeave, setSelectedLeave] = useState(null);

  const departments = ["IT", "Sales", "Marketing", "Engineering", "HR", "Finance"];

  // ✅ Fetch all companies
  const fetchCompanies = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/company/all`);
      setCompanies(res.data?.companies || res.data);
    } catch (err) {
      toast.error("Failed to fetch companies");
    }
  };

  // ✅ Fetch all leaves, employees, and companies
  const fetchLeaves = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/admin/all-leaves`);
      const leaveData = res.data?.leaves || res.data;
      setLeaves(leaveData);

      // 🧠 Fetch employee/admin details (supports both employee and admin-applied leaves)
      const uniqueEmpIds = [...new Set(leaveData.map(l => l.employeeId?._id || l.employeeId).filter(Boolean))];

      const employeePromises = uniqueEmpIds.map(async (empId) => {
        try {
          // 🔹 First try to fetch as an Employee
          const empRes = await axios.get(
            `${import.meta.env.VITE_API_URL}/employee/getEmployee/${empId}`
          );
          return { empId, data: empRes.data.employee };
        } catch (error) {
          // 🔹 If not found as Employee, try to fetch as an Admin (for admin-applied leaves)
          try {
            const adminRes = await axios.get(
              `${import.meta.env.VITE_API_URL}/getAdmin/${empId}`
            );
            const admin = adminRes.data?.admin;
            if (!admin) return null;

            // Normalize admin shape so it works with existing rendering logic
            const normalizedAdmin = {
              ...admin,
              // department is already a string on Admin
              department: admin.department || undefined,
              // use first assigned company (if multiple)
              company:
                Array.isArray(admin.company) && admin.company.length > 0
                  ? admin.company[0]
                  : admin.company,
            };

            return { empId, data: normalizedAdmin };
          } catch (error2) {
            // If both lookups fail, skip this record
            return null;
          }
        }
      });

      const employeeResults = await Promise.all(employeePromises);
      const empDataMap = {};
      const companyIds = new Set();

      // 🧩 Map employee/admin and extract valid company IDs
      employeeResults.forEach((item) => {
        if (item) {
          empDataMap[item.empId] = item.data;

          // ✅ FIX: ensure we only add company._id or string ID
          const companyField = item.data?.company;
          if (Array.isArray(companyField)) {
            companyField.forEach((c) => {
              if (c?._id) {
                companyIds.add(c._id);
              } else if (typeof c === "string") {
                companyIds.add(c);
              }
            });
          } else if (companyField?._id) {
            companyIds.add(companyField._id);
          } else if (typeof companyField === "string") {
            companyIds.add(companyField);
          }
        }
      });

      // 🏢 Fetch company details using proper ObjectId strings
      const companyPromises = [...companyIds].map(async (companyId) => {
        const compRes = await axios.get(`${import.meta.env.VITE_API_URL}/company/${companyId}`);
        return { companyId, data: compRes.data.company };
      });

      const companyResults = await Promise.all(companyPromises);
      const compDataMap = {};
      companyResults.forEach((item) => {
        if (item) compDataMap[item.companyId] = item.data;
      });

      setEmployeeDetails(empDataMap);
      setCompanyDetails(compDataMap);
    } catch (err) {
      toast.error("Failed to fetch leave data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCompanies();
    fetchLeaves();
  }, []);

  const handleAction = async (leaveId, status) => {
    try {
      const adminRemark =
        status === "Approved" ? "Leave approved by admin" : "Leave rejected by admin";

      await axios.put(`${import.meta.env.VITE_API_URL}/admin/update-leave/${leaveId}`, {
        status,
        adminRemark,
      });

      toast.success(`Leave ${status.toLowerCase()} successfully!`);
      fetchLeaves();
    } catch (err) {
      toast.error("Failed to update leave status");
    }
  };

  const handleView = (leave) => {
    setSelectedLeave(leave);
    setShowModal(true);
  };

  // ✅ Filter by company, department, status
  const filteredLeaves = leaves.filter((leave) => {
    const empId = leave.employeeId?._id || leave.employeeId;
    const emp = employeeDetails[empId];
    const comp =
      emp?.company && companyDetails[emp.company?._id || emp.company]
        ? companyDetails[emp.company?._id || emp.company]
        : null;

    // Normalize department: the API may return a string or an object like { _id, dep }
    const empDept = emp
      ? typeof emp.department === "string"
        ? emp.department
        : emp.department?.dep || emp.department?.name || undefined
      : undefined;

    const matchesCompany = !selectedCompany || comp?._id === selectedCompany;
    const matchesDept = !selectedDepartment || empDept === selectedDepartment;
    const matchesStatus = !selectedStatus || leave.status === selectedStatus;

    return matchesCompany && matchesDept && matchesStatus;
  });

  if (loading)
    return <div className="p-6 text-center text-gray-600">Loading leave requests...</div>;

  return (
    <div className="max-h-[85vh] overflow-y-auto bg-[#f8f9fa] p-4 sm:p-8 relative">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Leave Management Admin</h1>
        <p className="text-gray-600">
          Review, approve, or reject leave requests from employees
        </p>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-4 mb-6">
        <select
          value={selectedCompany}
          onChange={(e) => setSelectedCompany(e.target.value)}
          className="border rounded-md px-3 py-2 text-sm bg-white shadow-sm"
        >
          <option value="">All Companies</option>
          {companies.map((company) => (
            <option key={company._id} value={company._id}>
              {company.companyName}
            </option>
          ))}
        </select>

        <select
          value={selectedDepartment}
          onChange={(e) => setSelectedDepartment(e.target.value)}
          className="border rounded-md px-3 py-2 text-sm bg-white shadow-sm"
        >
          <option value="">All Departments</option>
          {departments.map((dept) => (
            <option key={dept} value={dept}>
              {dept}
            </option>
          ))}
        </select>

        <select
          value={selectedStatus}
          onChange={(e) => setSelectedStatus(e.target.value)}
          className="border rounded-md px-3 py-2 text-sm bg-white shadow-sm"
        >
          <option value="">All Status</option>
          <option value="Approved">Approved</option>
          <option value="Rejected">Rejected</option>
          <option value="Pending">Pending</option>
        </select>

        {(selectedCompany || selectedDepartment || selectedStatus) && (
          <button
            onClick={() => {
              setSelectedCompany("");
              setSelectedDepartment("");
              setSelectedStatus("");
            }}
            className="text-sm bg-gray-200 px-3 py-2 rounded-md hover:bg-gray-300 transition"
          >
            Clear Filters
          </button>
        )}
      </div>

      {/* Leave Table */}
      {/* Leave Table */}
      <div className="md:rounded-xl md:border md:border-gray-200 bg-transparent md:bg-white md:shadow-sm overflow-hidden relative">
        {filteredLeaves.length === 0 ? (
          <p className="p-6 text-center text-gray-500">No leave requests found.</p>
        ) : (
          <>
            {/* Desktop Table View */}
            <div className="hidden md:block overflow-x-auto">
              <table className="min-w-full text-sm text-left">
                <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
                  <tr>
                    <th className="p-4">Employee Name</th>
                    <th className="p-4">Department</th>
                    <th className="p-4">Company</th>
                    <th className="p-4">Leave Type</th>
                    <th className="p-4">Duration</th>
                    <th className="p-4">Status</th>
                    <th className="p-4 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredLeaves.map((leave) => {
                    const empId = leave.employeeId?._id || leave.employeeId;
                    const emp = employeeDetails[empId];
                    const comp = emp?.company && companyDetails[emp.company?._id || emp.company] ? companyDetails[emp.company?._id || emp.company] : null;
                    const empDept = emp ? (typeof emp.department === "string" ? emp.department : emp.department?.dep || emp.department?.name || undefined) : undefined;

                    return (
                      <tr key={leave._id} className="hover:bg-slate-50 transition-colors">
                        <td className="p-4 font-medium text-slate-800">{emp?.fullName || "—"}</td>
                        <td className="p-4 text-slate-600">{empDept || "—"}</td>
                        <td className="p-4 text-slate-600">{comp?.companyName || "—"}</td>
                        <td className="p-4 font-medium text-slate-700">
                          <span className="bg-blue-50 text-blue-700 px-2.5 py-1 rounded-md text-xs border border-blue-100">{leave.leaveType}</span>
                        </td>
                        <td className="p-4 text-slate-600 text-xs">
                          {new Date(leave.startDate).toLocaleDateString()} <br /> <span className="text-slate-400">to</span> {new Date(leave.endDate).toLocaleDateString()}
                        </td>
                        <td className="p-4 font-medium">
                          <span className={`px-2.5 py-1 rounded-full text-xs border ${
                            leave.status === "Approved" ? "bg-green-50 text-green-700 border-green-200" :
                            leave.status === "Rejected" ? "bg-red-50 text-red-700 border-red-200" :
                            "bg-yellow-50 text-yellow-700 border-yellow-200"
                          }`}>
                            {leave.status}
                          </span>
                        </td>
                        <td className="p-4 text-center">
                          <div className="flex items-center justify-center gap-2">
                            <button onClick={() => handleView(leave)} className="bg-slate-100 text-slate-600 p-1.5 rounded-md hover:bg-slate-200 transition" title="View Reason">
                              <FaEye className="w-4 h-4" />
                            </button>
                            {leave.status === "Pending" && (
                              <>
                                <button onClick={() => handleAction(leave._id, "Approved")} className="bg-green-50 text-green-600 p-1.5 rounded-md border border-green-200 hover:bg-green-100 transition" title="Approve">
                                  <Check className="w-4 h-4" />
                                </button>
                                <button onClick={() => handleAction(leave._id, "Rejected")} className="bg-red-50 text-red-600 p-1.5 rounded-md border border-red-200 hover:bg-red-100 transition" title="Reject">
                                  <X className="w-4 h-4" />
                                </button>
                              </>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Mobile Card View */}
            <div className="block md:hidden space-y-4">
              {filteredLeaves.map((leave) => {
                const empId = leave.employeeId?._id || leave.employeeId;
                const emp = employeeDetails[empId];
                const comp = emp?.company && companyDetails[emp.company?._id || emp.company] ? companyDetails[emp.company?._id || emp.company] : null;
                const empDept = emp ? (typeof emp.department === "string" ? emp.department : emp.department?.dep || emp.department?.name || undefined) : undefined;

                return (
                  <div key={leave._id} className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 flex flex-col gap-3 relative">
                    <div className="flex justify-between items-start mb-1">
                      <div>
                        <h3 className="font-bold text-slate-900 text-base">{emp?.fullName || "—"}</h3>
                        <p className="text-xs text-slate-500 font-medium mt-0.5">{empDept || "—"} • {comp?.companyName || "—"}</p>
                      </div>
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${
                        leave.status === "Approved" ? "bg-green-50 text-green-700 border-green-200" :
                        leave.status === "Rejected" ? "bg-red-50 text-red-700 border-red-200" :
                        "bg-yellow-50 text-yellow-700 border-yellow-200"
                      }`}>
                        {leave.status}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 text-sm">
                      <span className="bg-blue-50 text-blue-700 px-2 py-0.5 rounded text-xs font-semibold border border-blue-100">{leave.leaveType}</span>
                    </div>

                    <div className="text-xs text-slate-600 bg-slate-50 p-2 rounded-lg border border-slate-100 flex items-center justify-between">
                      <div><span className="text-slate-400 block mb-0.5">Start Date</span> <span className="font-medium text-slate-700">{new Date(leave.startDate).toLocaleDateString()}</span></div>
                      <div className="text-slate-300">→</div>
                      <div className="text-right"><span className="text-slate-400 block mb-0.5">End Date</span> <span className="font-medium text-slate-700">{new Date(leave.endDate).toLocaleDateString()}</span></div>
                    </div>

                    <div className="flex gap-2 mt-2 pt-3 border-t border-slate-100">
                      <button onClick={() => handleView(leave)} className="flex-1 flex items-center justify-center gap-2 bg-slate-100 text-slate-700 py-2 rounded-lg font-medium text-sm hover:bg-slate-200 transition">
                        <FaEye className="w-4 h-4" /> View
                      </button>
                      {leave.status === "Pending" && (
                        <>
                          <button onClick={() => handleAction(leave._id, "Approved")} className="flex-1 flex items-center justify-center gap-2 bg-green-50 text-green-700 border border-green-200 py-2 rounded-lg font-medium text-sm hover:bg-green-100 transition">
                            <Check className="w-4 h-4" /> Approve
                          </button>
                          <button onClick={() => handleAction(leave._id, "Rejected")} className="flex-1 flex items-center justify-center gap-2 bg-red-50 text-red-700 border border-red-200 py-2 rounded-lg font-medium text-sm hover:bg-red-100 transition">
                            <X className="w-4 h-4" /> Reject
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}
      </div>

      {/* 🟦 Inline Modal */}
      {showModal && selectedLeave && (
        <div className="absolute top-10 left-1/2 transform -translate-x-1/2 bg-white border border-gray-200 rounded-lg shadow-lg w-[380px] p-5 z-10">
          <h2 className="text-lg text-center font-semibold mb-5 text-gray-800">
            Leave Details
          </h2>
          <p className="pb-2">
            <strong className="text-green-600 font-xl font-bold">Type:</strong>{" "}
            {selectedLeave.leaveType}
          </p>
          <p>
            <strong className="text-red-600 font-xl font-bold">Duration:</strong>{" "}
            {new Date(selectedLeave.startDate).toLocaleDateString()} →{" "}
            {new Date(selectedLeave.endDate).toLocaleDateString()}
          </p>
          <p className="mt-2">
            <strong>Reason:</strong> {selectedLeave.reason || "—"}
          </p>
          <p className="mt-2">
            <strong>Status:</strong>{" "}
            <span
              className={
                selectedLeave.status === "Approved"
                  ? "text-green-600 font-xl font-bold"
                  : selectedLeave.status === "Rejected"
                  ? "text-red-600 font-xl font-bold"
                  : "text-yellow-600 font-xl font-bold"
              }
            >
              {selectedLeave.status}
            </span>
          </p>

          <div className="mt-7 text-center">
            <button
              onClick={() => setShowModal(false)}
              className="px-4 py-2 bg-red-600 text-white font-semibold font-lg rounded-md hover:bg-red-700"
            >
              Close
            </button>
          </div>
        </div>
      )}


      <LeavePage/>
    </div>
  );
};