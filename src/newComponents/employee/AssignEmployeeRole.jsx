import React, { useEffect, useState } from "react";

const AssignEmployeeRole = () => {
    const [employees, setEmployees] = useState([]);
    const [companies, setCompanies] = useState([]);
    const [roles, setRoles] = useState([]);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");

    const [formData, setFormData] = useState({
        selectedEmployee: "",
        selectedCompany: "",
        selectedRoles: [],
        selectedSubRoles: [],
        selectedPoints: [],
    });

    // ============================================
    // FETCH EMPLOYEES
    // ============================================
    const getAllEmployees = async () => {
        try {
            const res = await fetch("http://localhost:4000/employee/allEmployee");
            const data = await res.json();
            if (res.ok) setEmployees(data.employees || []);
        } catch (err) {
            console.error("❌ Error fetching employees:", err);
        }
    };

    // FETCH ROLES (from EmployeeRole instead of admin Role)
    const getAllRoles = async () => {
        try {
            const res = await fetch("http://localhost:4000/employeerole/getemployeerole");
            const data = await res.json();
            if (res.ok) setRoles(data.data || []);
        } catch (err) {
            console.error("❌ Error fetching roles:", err);
        }
    };

    // FETCH ALL COMPANIES
    const getAllCompanies = async () => {
        try {
            const res = await fetch("http://localhost:4000/company/all");
            const data = await res.json();
            if (res.ok) setCompanies(data.companies || []);
        } catch (err) {
            console.error("❌ Error fetching companies:", err);
        }
    };

    // ============================================
    // FETCH COMPANY BY EMPLOYEE
    // ============================================
    const getCompaniesByEmployee = async (employeeId) => {
        try {
            const res = await fetch(`http://localhost:4000/employee/getCompanyByEmployeeId/${employeeId}`);
            const data = await res.json();

            console.log("🏢 Employee Companies Data:", data);

            if (data.success) {
                const companiesData = data.assignedCompanies;

                // FIX: Convert object → array
                setCompanies(Array.isArray(companiesData) ? companiesData : [companiesData]);
            } else {
                setCompanies([]);
            }
        } catch (err) {
            console.error("❌ Error fetching employee companies:", err);
            setCompanies([]);
        }
    };

        // Fetch assigned roles for an employee and company by calling existing employee endpoint
        const getAssignedRolesForEmployeeAndCompany = async (employeeId, companyId) => {
            if (!employeeId || !companyId) return;

            try {
                const res = await fetch(`http://localhost:4000/employee/getAssignedRoles/${employeeId}`);
                const data = await res.json();
                console.log("👷‍♂️ Employee assigned roles raw:", data);

                if (!data.success) {
                    setFormData((prev) => ({ ...prev, selectedRoles: [], selectedSubRoles: [], selectedPoints: [] }));
                    return;
                }

                const assigned = Array.isArray(data.assignedRoles) ? data.assignedRoles : [];

                // Filter assignments that include the selected company
                const matched = assigned.filter((ar) => Array.isArray(ar.companyIds) && ar.companyIds.map(String).includes(String(companyId)));

                const roleSet = new Set();
                const subRoleSet = new Set();
                const pointSet = new Set();

                matched.forEach((ar) => {
                    (ar.roleId || []).forEach((r) => roleSet.add(String(r)));

                    // ar.subRoles items might be ObjectId strings or objects like { _id, subRoleName }
                    (ar.subRoles || []).forEach((s) => {
                        if (!s) return;
                        if (typeof s === "object") {
                            const id = s._id ? String(s._id) : String(s);
                            subRoleSet.add(id);
                        } else {
                            subRoleSet.add(String(s));
                        }
                    });

                    (ar.points || []).forEach((p) => pointSet.add(String(p)));
                });

                setFormData((prev) => ({
                    ...prev,
                    selectedRoles: Array.from(roleSet),
                    selectedSubRoles: Array.from(subRoleSet),
                    selectedPoints: Array.from(pointSet),
                }));
            } catch (err) {
                console.error("❌ Error fetching assigned roles for employee:", err);
                setFormData((prev) => ({ ...prev, selectedRoles: [], selectedSubRoles: [], selectedPoints: [] }));
            }
        };

    // ============================================
    // USE EFFECTS
    // ============================================
    useEffect(() => {
        getAllEmployees();
        getAllRoles();
    }, []);

    useEffect(() => {
        if (formData.selectedEmployee) {
            getCompaniesByEmployee(formData.selectedEmployee);
        } else {
            setCompanies([]);
        }

        // Clear company + role selections when employee changes
        setFormData((prev) => ({ ...prev, selectedCompany: "", selectedRoles: [], selectedSubRoles: [], selectedPoints: [] }));
    }, [formData.selectedEmployee]);


    // When company is selected, fetch assigned roles/subroles/points for that employee+company
    useEffect(() => {
        if (formData.selectedEmployee && formData.selectedCompany) {
            getAssignedRolesForEmployeeAndCompany(formData.selectedEmployee, formData.selectedCompany);
        } else {
            // clear selections when no company
            setFormData((prev) => ({ ...prev, selectedRoles: [], selectedSubRoles: [], selectedPoints: [] }));
        }
    }, [formData.selectedCompany, formData.selectedEmployee]);

    // ============================================
    // TOGGLE HELPERS
    // ============================================
    const toggleSelection = (array, item) => {
        const s = String(item);
        return array.includes(s) ? array.filter((i) => i !== s) : [...array, s];
    };

    const handleRoleToggle = (roleId) => {
        const id = String(roleId);
        setFormData((prev) => ({
            ...prev,
            selectedRoles: toggleSelection(prev.selectedRoles, id),
        }));
    };

    const handleSubRoleToggle = (subRoleId) => {
        const id = String(subRoleId);
        setFormData((prev) => ({
            ...prev,
            selectedSubRoles: toggleSelection(prev.selectedSubRoles, id),
        }));
    };

    const handlePointToggle = (point) => {
        const p = String(point);
        setFormData((prev) => ({
            ...prev,
            selectedPoints: toggleSelection(prev.selectedPoints, p),
        }));
    };

    // ============================================
    // ASSIGN ROLE
    // ============================================
    const handleAssign = async () => {
        const { selectedEmployee, selectedCompany, selectedRoles, selectedSubRoles, selectedPoints } = formData;

        if (!selectedEmployee) return alert("Please select an employee.");
        if (!selectedCompany) return alert("Please select a company.");
        if (!selectedRoles.length) return alert("Please select at least one role.");

        setLoading(true);
        setMessage("");
        console.log(selectedEmployee, selectedCompany, selectedRoles, selectedSubRoles, selectedPoints  );
        
        try {
            const payload = {
                employeeId: selectedEmployee,
                companyIds: [selectedCompany],
                workRoles: selectedRoles,
                subRoles: selectedSubRoles,
                points: selectedPoints,
            };

            console.log("📤 Sending Payload:", payload);

            const res = await fetch("http://localhost:4000/employee/assignRole", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });

            const result = await res.json();
            console.log("📥 Response:", result);

            if (res.ok) {
                setMessage("✅ Work Role assigned successfully!");

                setFormData({
                    selectedEmployee: "",
                    selectedCompany: "",
                    selectedRoles: [],
                    selectedSubRoles: [],
                    selectedPoints: [],
                });

                setCompanies([]);
                getAllEmployees();
                getAllRoles();
            } else {
                setMessage(`❌ ${result.message || "Failed to assign role"}`);
            }
        } catch (error) {
            console.error("❌ Error assigning role:", error);
            setMessage("❌ Something went wrong.");
        } finally {
            setLoading(false);
        }
    };

    // ============================================
    // RENDER UI
    // ============================================
    return (
        <div className="mx-auto mt-12 max-w-3xl rounded-lg bg-white p-8 shadow-md">
            <h2 className="mb-6 text-center text-2xl font-semibold">Assign Work Role to Employee</h2>

            {message && (
                <div className={`mb-4 text-center font-medium ${message.startsWith("✅") ? "text-green-600" : "text-red-600"}`}>{message}</div>
            )}

            <form
                className="grid grid-cols-1 gap-4"
                onSubmit={(e) => e.preventDefault()}
            >
                {/* EMPLOYEE DROPDOWN */}
                <div>
                    <label className="mb-1 font-medium text-gray-700">Select Employee</label>
                    <select
                        value={formData.selectedEmployee}
                        onChange={(e) => setFormData({ ...formData, selectedEmployee: e.target.value })}
                        className="w-full rounded border px-3 py-2"
                    >
                        <option value="">-- Choose Employee --</option>
                        {employees.filter((emp) => emp.accountActive === true).map((emp) => (
                            <option
                                key={emp._id}
                                value={emp._id}
                            >
                                {emp.fullName}
                            </option>
                        ))}
                    </select>
                </div>

                {/* COMPANY DROPDOWN */}
                <div>
                    <label className="mb-1 font-medium text-gray-700">Select Company</label>
                    <select
                        value={formData.selectedCompany}
                        onChange={(e) => setFormData({ ...formData, selectedCompany: e.target.value })}
                        className="w-full rounded border px-3 py-2"
                        disabled={!formData.selectedEmployee}
                    >
                        <option value="">{formData.selectedEmployee ? "-- Choose Assigned Company --" : "-- Select Employee First --"}</option>

                        {/* SAFE ARRAY LOOP */}
                        {companies.map((company) => (
                            <option
                                key={company._id}
                                value={company._id}
                            >
                                {company.companyName}
                            </option>
                        ))}
                    </select>
                </div>

                {/* ROLES, SUBROLES, POINTS */}
                <div className="rounded border bg-gray-50 p-4">
                    <label className="mb-2 block font-medium text-gray-700">Roles, SubRoles & Points</label>

                    {roles.map((role) => (
                        <div
                            key={role._id}
                            className="mb-3 border-b pb-2"
                        >
                            {/* Role */}
                            <label className="flex items-center gap-2">
                                <input
                                    type="checkbox"
                                    checked={formData.selectedRoles.includes(String(role._id))}
                                    onChange={() => handleRoleToggle(role._id)}
                                />
                                <strong>{role.role}</strong>
                            </label>

                            {/* SubRoles */}
                            {role.subRole?.map((sub) => (
                                <div
                                    key={sub._id}
                                    className="ml-5 mt-2"
                                >
                                    <label className="flex items-center gap-2">
                                        <input
                                            type="checkbox"
                                            checked={formData.selectedSubRoles.includes(String(sub._id))}
                                            onChange={() => handleSubRoleToggle(sub._id)}
                                        />
                                        {sub.subRoleName}
                                    </label>

                                    {/* Points */}
                                    {sub.points?.map((point, idx) => (
                                        <label
                                            key={idx}
                                            className="ml-6 flex items-center gap-2"
                                        >
                                            <input
                                                type="checkbox"
                                                checked={formData.selectedPoints.includes(String(point))}
                                                onChange={() => handlePointToggle(point)}
                                            />
                                            {point}
                                        </label>
                                    ))}
                                </div>
                            ))}
                        </div>
                    ))}
                </div>

                {/* SUBMIT BUTTON */}
                <button
                    type="button"
                    onClick={handleAssign}
                    disabled={loading}
                    className={`w-full rounded py-3 text-white ${loading ? "bg-gray-400" : "bg-black hover:bg-gray-800"}`}
                >
                    {loading ? "Assigning..." : "Assign Work Role"}
                </button>
            </form>
        </div>
    );
};

export default AssignEmployeeRole;
