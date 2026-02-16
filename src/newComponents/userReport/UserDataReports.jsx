import React, { useState, useEffect } from "react";
import { Eye, X, Users, CheckCircle, XCircle } from "lucide-react";

const API_URL = "http://localhost:4000";

// Helper component to display detail fields
const DetailField = ({ label, value, isPassword = false }) => {
  const [showPassword, setShowPassword] = useState(false);

  if (isPassword) {
    return (
      <div>
        <p className="text-xs font-medium text-gray-500 mb-2">{label}</p>
        <div className="flex items-center gap-2">
          <input
            type={showPassword ? "text" : "password"}
            value={value || "N/A"}
            readOnly
            className="flex-1 px-3 py-2 bg-gray-100 border border-gray-300 rounded text-gray-900 text-sm"
          />
          <button
            onClick={() => setShowPassword(!showPassword)}
            className="px-3 py-2 text-sm bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors font-medium whitespace-nowrap"
          >
            {showPassword ? "Hide" : "Show"}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <p className="text-xs font-medium text-gray-500 mb-1">{label}</p>
      <p className="text-sm text-gray-800">{value || "N/A"}</p>
    </div>
  );
};

const UserDataReports = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [viewingUser, setViewingUser] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterRole, setFilterRole] = useState("All");
  const [activeTab, setActiveTab] = useState("active");

  // Fetch all users (admins and employees)
  useEffect(() => {
    fetchAllUsers();
  }, []);

  const fetchAllUsers = async () => {
    try {
      setLoading(true);
      setError(null);

      const [adminRes, employeeRes] = await Promise.all([
        fetch(`${API_URL}/getAdmins`),
        fetch(`${API_URL}/employee/allEmployee`),
      ]);

      const adminData = await adminRes.json();
      const employeeData = await employeeRes.json();

      if (!adminRes.ok) throw new Error(adminData.message || "Failed to fetch admins");
      if (!employeeRes.ok) throw new Error(employeeData.message || "Failed to fetch employees");

      const admins = (adminData.admins || adminData || []).map((admin) => ({
        ...admin,
        userType: "Admin",
      }));

      const employees = (employeeData.employees || employeeData || []).map((emp) => ({
        ...emp,
        userType: "Employee",
      }));

      const allUsers = [...admins, ...employees];
      setUsers(allUsers);
    } catch (err) {
      setError(err.message || "Failed to fetch user data");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Separate active and inactive users
  const activeUsers = users.filter((u) => u.accountActive !== false);
  const inactiveUsers = users.filter((u) => u.accountActive === false);

  // Get users based on active tab
  const tabUsers = activeTab === "active" ? activeUsers : inactiveUsers;

  // Filter users based on search and role
  const filteredUsers = tabUsers.filter((user) => {
    const displayName = user.fullName || user.name || "";
    const displayPhone = user.phone || user.phoneNumber || "";
    const displayEmail = user.email || "";

    const matchesSearch =
      displayName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      displayEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
      displayPhone.includes(searchTerm);

    const matchesRole =
      filterRole === "All" ||
      (filterRole === "Admin" && user.userType === "Admin") ||
      (filterRole === "Employee" && user.userType === "Employee");

    return matchesSearch && matchesRole;
  });

  const handleViewDetails = (user) => {
    setViewingUser(user);
    setIsViewModalOpen(true);
  };

  const closeViewModal = () => {
    setIsViewModalOpen(false);
    setViewingUser(null);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <p className="mt-4 text-lg text-gray-600">Loading user data...</p>
        </div>
      </div>
    );
  }

  const totalActive = activeUsers.length;
  const totalInactive = inactiveUsers.length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 p-6">
      {/* Header Section */}
      <div className="mb-8">
        <div className="mb-2 flex items-center gap-3">
          <Users size={32} className="text-blue-600" />
          <h1 className="text-3xl font-bold text-gray-900">User Data Reports</h1>
        </div>
        <p className="text-sm text-gray-600">
          Monitor all users (Admins and Employees) with detailed information
        </p>
      </div>

      {/* Statistics Cards - Top of Table */}
      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-100">
          <p className="text-gray-600 text-sm">Total Users</p>
          <p className="text-3xl font-bold text-gray-900">{users.length}</p>
        </div>
        <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-100">
          <p className="text-gray-600 text-sm">Admins</p>
          <p className="text-3xl font-bold text-purple-600">
            {users.filter((u) => u.userType === "Admin").length}
          </p>
        </div>
        <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-100">
          <p className="text-gray-600 text-sm">Employees</p>
          <p className="text-3xl font-bold text-blue-600">
            {users.filter((u) => u.userType === "Employee").length}
          </p>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-700 font-medium">{error}</p>
        </div>
      )}

      {/* Search & Filter Bar */}
      <div className="mb-6 rounded-xl border border-gray-100 bg-white p-4 shadow-md">
        <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
          <div className="w-full flex-1 sm:w-auto">
            <input
              type="search"
              placeholder="Search by name, email, or phone..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm transition-all focus:border-transparent focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="flex w-full gap-2 sm:w-auto">
            <select
              value={filterRole}
              onChange={(e) => setFilterRole(e.target.value)}
              className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm transition-all focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="All">All Roles</option>
              <option value="Admin">Admins</option>
              <option value="Employee">Employees</option>
            </select>
            <button
              onClick={() => {
                setSearchTerm("");
                setFilterRole("All");
              }}
              className="rounded-lg bg-gray-900 px-4 py-2 text-sm font-medium text-white transition-colors duration-200 hover:bg-gray-800"
            >
              Clear
            </button>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="mb-6 flex flex-wrap gap-3">
        <button
          onClick={() => setActiveTab("active")}
          className={`relative flex items-center gap-2 rounded-full px-6 py-3 text-sm font-semibold transition-all duration-300 ${
            activeTab === "active"
              ? "bg-emerald-50 text-emerald-600 shadow-md"
              : "bg-white text-gray-600 hover:bg-gray-50 hover:shadow-sm"
          }`}
        >
          <CheckCircle size={18} />
          Active ({totalActive})
          {activeTab === "active" && (
            <span className="absolute -bottom-2 left-4 right-4 h-1 animate-pulse rounded-full bg-emerald-600" />
          )}
        </button>

        <button
          onClick={() => setActiveTab("inactive")}
          className={`relative flex items-center gap-2 rounded-full px-6 py-3 text-sm font-semibold transition-all duration-300 ${
            activeTab === "inactive"
              ? "bg-rose-50 text-rose-600 shadow-md"
              : "bg-white text-gray-600 hover:bg-gray-50 hover:shadow-sm"
          }`}
        >
          <XCircle size={18} />
          Inactive ({totalInactive})
          {activeTab === "inactive" && (
            <span className="absolute -bottom-2 left-4 right-4 h-1 animate-pulse rounded-full bg-rose-600" />
          )}
        </button>
      </div>

      {/* Statistics Card */}
      <div className="mb-6">
        {activeTab === "active" ? (
          <div className="rounded-lg border border-emerald-200 bg-gradient-to-br from-emerald-50 to-emerald-100 p-4 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-emerald-700">Total Active Users</p>
                <p className="text-3xl font-bold text-emerald-600">{totalActive}</p>
              </div>
              <CheckCircle size={40} className="text-emerald-600 opacity-20" />
            </div>
          </div>
        ) : (
          <div className="rounded-lg border border-rose-200 bg-gradient-to-br from-rose-50 to-rose-100 p-4 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-rose-700">Total Inactive Users</p>
                <p className="text-3xl font-bold text-rose-600">{totalInactive}</p>
              </div>
              <XCircle size={40} className="text-rose-600 opacity-20" />
            </div>
          </div>
        )}
      </div>

      {/* Data Table */}
      {filteredUsers.length === 0 ? (
        <div className="rounded-xl border border-gray-100 bg-white p-12 text-center shadow-md">
          <p className="text-lg text-gray-600">
            No {activeTab} {filterRole !== "All" ? filterRole.toLowerCase() : ""} records found.
          </p>
        </div>
      ) : (
        <div className="animate-in fade-in slide-in-from-bottom-4 overflow-hidden rounded-xl border border-gray-100 bg-white shadow-lg duration-500">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-gray-700">
              <thead className="border-b border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50">
                <tr>
                  <th className="px-4 py-4 text-left font-semibold text-gray-700">#</th>
                  <th className="px-4 py-4 text-left font-semibold text-gray-700">User</th>
                  <th className="px-4 py-4 text-left font-semibold text-gray-700">Email</th>
                  <th className="px-4 py-4 text-left font-semibold text-gray-700">Phone</th>
                  <th className="px-4 py-4 text-left font-semibold text-gray-700">Role</th>
                  <th className="px-4 py-4 text-left font-semibold text-gray-700">Department</th>
                  <th className="px-4 py-4 text-left font-semibold text-gray-700">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((user, index) => (
                  <tr
                    key={user._id}
                    className="border-b border-gray-100 transition-colors hover:bg-blue-50"
                  >
                    <td className="px-4 py-4 font-semibold text-gray-600">{index + 1}</td>
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-blue-400 to-indigo-600 text-sm font-semibold text-white">
                          {(user.fullName || user.name || "?")[0].toUpperCase()}
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-gray-800">
                            {user.fullName || user.name || "N/A"}
                          </p>
                          <p className="text-xs text-gray-500">
                            {user.userType === "Admin" ? "👤 Admin" : "👨‍💼 Employee"}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4 text-gray-600">{user.email || "N/A"}</td>
                    <td className="px-4 py-4 text-gray-600">
                      {user.phone || user.phoneNumber || "N/A"}
                    </td>
                    <td className="px-4 py-4">
                      <span
                        className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${
                          user.userType === "Admin"
                            ? "bg-purple-100 text-purple-800"
                            : "bg-blue-100 text-blue-800"
                        }`}
                      >
                        {user.userType}
                      </span>
                    </td>
                    <td className="px-4 py-4 text-gray-600">
                      {typeof user.department === "string"
                        ? user.department
                        : user.department?.dep || "—"}
                    </td>
                    <td className="px-4 py-4">
                      <button
                        onClick={() => handleViewDetails(user)}
                        className="inline-flex items-center gap-2 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-xs font-medium"
                        title="View all details"
                      >
                        <Eye size={16} />
                        View
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* View Details Modal */}
      {isViewModalOpen && viewingUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
          <div className="bg-white rounded-lg shadow-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="sticky top-0 flex items-center justify-between border-b border-gray-200 px-6 py-4 bg-gradient-to-r from-blue-50 to-indigo-50">
              <h2 className="text-2xl font-bold text-gray-900">User Details</h2>
              <button
                onClick={closeViewModal}
                className="text-gray-500 hover:text-gray-700 transition-colors"
              >
                <X size={24} />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6">
              {/* User Header with Avatar */}
              <div className="mb-8">
                <div className="flex items-center gap-6">
                  <div className="flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-blue-400 to-indigo-600 text-3xl font-bold text-white">
                    {(viewingUser.fullName || viewingUser.name || "?")[0].toUpperCase()}
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900">
                      {viewingUser.fullName || viewingUser.name || "N/A"}
                    </h3>
                    <p className="mt-1 text-sm text-gray-600">{viewingUser.userType}</p>
                  </div>
                </div>
              </div>

              {/* User Info Grid */}
              <div className="grid grid-cols-2 gap-6 rounded-lg bg-gray-50 p-6">
                {/* Contact Information */}
                <div>
                  <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-gray-700">
                    Contact Information
                  </h3>
                  <div className="space-y-2">
                    <DetailField label="Email" value={viewingUser.email} />
                    <DetailField label="Phone" value={viewingUser.phone || viewingUser.phoneNumber} />
                  </div>
                </div>

                {/* Work Information */}
                <div>
                  <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-gray-700">
                    Work Information
                  </h3>
                  <div className="space-y-2">
                    <DetailField
                      label="Department"
                      value={
                        typeof viewingUser.department === "string"
                          ? viewingUser.department
                          : viewingUser.department?.dep
                      }
                    />
                    <DetailField label="Role" value={viewingUser.role} />
                  </div>
                </div>

                {/* Status Information */}
                <div>
                  <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-gray-700">
                    Status
                  </h3>
                  <div className="space-y-2">
                    <div>
                      <p className="text-xs font-medium text-gray-500">Account Status</p>
                      <div className="mt-1">
                        {viewingUser.accountActive ? (
                          <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700">
                            <CheckCircle size={14} />
                            Active
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 rounded-full bg-rose-100 px-3 py-1 text-xs font-semibold text-rose-700">
                            <XCircle size={14} />
                            Inactive
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Additional Fields */}
                <div>
                  <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-gray-700">
                    Additional Info
                  </h3>
                  <div className="space-y-2">
                    <DetailField label="Designation" value={viewingUser.designation} />
                    <DetailField
                      label="Join Date"
                      value={
                        viewingUser.createdAt
                          ? new Date(viewingUser.createdAt).toLocaleDateString("en-IN")
                          : "N/A"
                      }
                    />
                  </div>
                </div>
              </div>

              {/* Password Section */}
              <div className="mt-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Security Information
                </h3>
                <div className="rounded-lg border border-red-200 bg-red-50 p-4">
                  <DetailField
                    label="Password"
                    value={viewingUser.password}
                    isPassword={true}
                  />
                </div>
              </div>

              {/* Company Information */}
              {viewingUser.company && (
                <div className="mt-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Company Information
                  </h3>
                  <div className="rounded-lg bg-gray-50 p-4">
                    <DetailField
                      label="Company"
                      value={
                        Array.isArray(viewingUser.company)
                          ? viewingUser.company.join(", ")
                          : viewingUser.company
                      }
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="border-t border-gray-200 px-6 py-4 bg-gray-50 flex justify-end">
              <button
                onClick={closeViewModal}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserDataReports;