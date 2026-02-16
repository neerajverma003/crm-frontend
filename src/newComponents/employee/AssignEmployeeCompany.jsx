import React, { useEffect, useState } from "react";

const AssignEmployeeCompany = () => {
    const [employeeList, setEmployeeList] = useState([]);
    const [companyList, setCompanyList] = useState([]);
    const [loading, setLoading] = useState(false);

    const [formData, setFormData] = useState({
        selectedEmployee: "",
        assignedCompanies: [],
    });

    const getAllCompany = async () => {
        try {
            const response = await fetch("http://localhost:4000/company/all");
            const result = await response.json();
            setCompanyList(result.companies || []);
        } catch (error) {
            console.error("❌ Failed to fetch companies:", error);
        }
    };

    const getAllEmployees = async () => {
        try {
            const response = await fetch("http://localhost:4000/employee/allEmployee");
            const result = await response.json();
            setEmployeeList(result.employees || []);
        } catch (error) {
            console.error("❌ Failed to fetch employees:", error);
        }
    };

    useEffect(() => {
        getAllCompany();
        getAllEmployees();
    }, []);

    const handleInputChange = (field, value) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
    };

    const handleCheckboxChange = (companyId) => {
        setFormData((prev) => {
            const { assignedCompanies } = prev;
            return assignedCompanies.includes(companyId)
                ? { ...prev, assignedCompanies: assignedCompanies.filter((id) => id !== companyId) }
                : { ...prev, assignedCompanies: [...assignedCompanies, companyId] };
        });
    };

    const handleAssign = async () => {
        const { selectedEmployee, assignedCompanies } = formData;

        if (!selectedEmployee) return alert("Please select an employee.");
        if (!assignedCompanies.length) return alert("Please select at least one company.");

        const payload = { employeeId: selectedEmployee, companyIds: assignedCompanies };

        setLoading(true);
        try {
            const res = await fetch("http://localhost:4000/employee/assign", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });
            const result = await res.json();
            if (res.ok) {
                alert("✅ Companies assigned successfully!");
                setFormData({ selectedEmployee: "", assignedCompanies: [] });
            } else {
                alert(result.message || "❌ Failed to assign companies.");
            }
        } catch (error) {
            console.error("❌ Error assigning companies:", error);
            alert("Something went wrong. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="mx-auto mt-12 max-w-3xl rounded-lg bg-white p-8 shadow-md">
            <h2 className="mb-6 text-center text-2xl font-semibold">Assign Company to Employee</h2>

            <form className="grid grid-cols-1 gap-4">
                {/* Employee Dropdown */}
                <div className="flex flex-col">
                    <label className="mb-1 font-medium text-gray-700">Select Employee</label>
                    <select
                        value={formData.selectedEmployee}
                        onChange={(e) => handleInputChange("selectedEmployee", e.target.value)}
                        className="rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-black"
                    >
                        <option value="">-- Choose Employee --</option>
                        {employeeList.length > 0 ? (
                            employeeList.map((employee) => (
                                <option
                                    key={employee._id}
                                    value={employee._id}
                                >
                                    {employee.fullName} ({employee.department?.dep || "No Dept"})
                                </option>
                            ))
                        ) : (
                            <option disabled>Loading employees...</option>
                        )}
                    </select>
                </div>

                {/* Company Checkboxes */}
                <div className="flex flex-col gap-2">
                    <label className="mb-1 font-medium text-gray-700">Assign Companies</label>
                    {companyList.length > 0 ? (
                        companyList.map((company) => (
                            <div
                                key={company._id}
                                className="flex items-center gap-2"
                            >
                                <input
                                    type="checkbox"
                                    checked={formData.assignedCompanies.includes(company._id)}
                                    onChange={() => handleCheckboxChange(company._id)}
                                    className="h-4 w-4 rounded border-gray-300 text-black focus:ring-black"
                                />
                                <label className="font-medium text-gray-700">{company.companyName}</label>
                            </div>
                        ))
                    ) : (
                        <p>Loading companies...</p>
                    )}
                </div>

                {/* Assign Button */}
                <button
                    type="button"
                    onClick={handleAssign}
                    disabled={loading}
                    className={`w-full rounded-md py-3 font-semibold text-white ${
                        loading ? "bg-gray-400" : "bg-black hover:bg-gray-800"
                    } transition-colors`}
                >
                    {loading ? "Assigning..." : "Assign"}
                </button>
            </form>
        </div>
    );
};

export default AssignEmployeeCompany;
