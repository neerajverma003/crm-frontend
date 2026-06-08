const fs = require('fs');

const filePath = 'src/newComponents/attendance/EmployeeTable.jsx';
let content = fs.readFileSync(filePath, 'utf-8');

// 1. Add states
const stateVars = `    const [remarksList, setRemarksList] = useState([{ title: "", amount: "", type: "Amount", isSaved: false }]);
    const [savingSalary, setSavingSalary] = useState(false);
    const [salaryStatus, setSalaryStatus] = useState("Pending");`;
content = content.replace('    const [isEditModalOpen, setIsEditModalOpen] = useState(false);', '    const [isEditModalOpen, setIsEditModalOpen] = useState(false);\n' + stateVars);

// 2. Modify fetchMonthlyAttendance to set states based on saved data
const oldFetch = `            // Fetch saved salary summary if exists
            try {
                const salaryRes = await axios.get(
                    \`\${import.meta.env.VITE_API_URL}/salary?employeeId=\${user._id}&month=\${monthNum}&year=\${year}\`,
                    { headers: { Authorization: \`Bearer \${token}\` } }
                );
                if (salaryRes.data && salaryRes.data.success && salaryRes.data.data) {
                    setSavedSalarySummary(salaryRes.data.data);
                } else {
                    setSavedSalarySummary(null);
                }
            } catch (err) {
                setSavedSalarySummary(null);
            }`;

const newFetch = `            // Fetch saved salary summary if exists
            try {
                const salaryRes = await axios.get(
                    \`\${import.meta.env.VITE_API_URL}/salary?employeeId=\${user._id}&month=\${monthNum}&year=\${year}\`,
                    { headers: { Authorization: \`Bearer \${token}\` } }
                );
                if (salaryRes.data && salaryRes.data.success && salaryRes.data.data) {
                    const savedSalary = salaryRes.data.data;
                    setSavedSalarySummary(savedSalary);
                    setSalaryStatus(savedSalary.status || "Pending");
                    if (savedSalary.notes) {
                        try {
                            const parsedRemarks = JSON.parse(savedSalary.notes);
                            if (parsedRemarks && parsedRemarks.length > 0) {
                                setRemarksList(parsedRemarks.map(r => ({ ...r, isSaved: true })));
                            } else {
                                setRemarksList([{ title: "", amount: "", type: "Amount", isSaved: false }]);
                            }
                        } catch (e) {
                            setRemarksList([{ title: "", amount: "", type: "Amount", isSaved: false }]);
                        }
                    } else {
                        setRemarksList([{ title: "", amount: "", type: "Amount", isSaved: false }]);
                    }
                } else {
                    setSavedSalarySummary(null);
                    setSalaryStatus("Pending");
                    setRemarksList([{ title: "", amount: "", type: "Amount", isSaved: false }]);
                }
            } catch (err) {
                setSavedSalarySummary(null);
                setSalaryStatus("Pending");
                setRemarksList([{ title: "", amount: "", type: "Amount", isSaved: false }]);
            }`;
content = content.replace(oldFetch, newFetch);

// 3. Add saveSalarySummary function before return (
const saveFunc = `    const saveSalarySummary = async (monthlyBaseSalary, perDaySalary, stats, earnedAmount, totalRemarkAmount, totalPayable) => {
        if (!selectedUser?._id) {
            alert("Please select an employee");
            return;
        }
        try {
            setSavingSalary(true);
            const presentDays = stats.present + stats.gracePresent + stats.late + (stats.halfDay * 0.5) + stats.sunday + (stats.sundayWorking * 2) + stats.cl + stats.holiday;
            const attendancePercentage = stats.total > 0 ? (presentDays / stats.total) * 100 : 0;
            
            const attendanceSummary = {
                present: stats.present, absent: stats.absent, late: stats.late,
                halfDay: stats.halfDay || 0, gracePresent: stats.gracePresent,
                sunday: stats.sunday || 0, sundayWorking: stats.sundayWorking || 0,
                holiday: stats.holiday || 0, total: stats.total,
            };

            const salarySummaryObj = {
                baseSalary: monthlyBaseSalary, perDaySalary: parseFloat(perDaySalary.toFixed(2)),
                workingDaysAllowed: stats.total, workingDaysPresent: presentDays,
                totalEarned: parseFloat(earnedAmount.toFixed(2)), deductions: totalRemarkAmount,
                netPayable: parseFloat(totalPayable.toFixed(2)), attendancePercentage: parseFloat(attendancePercentage.toFixed(2)),
            };

            const salaryData = {
                employeeId: selectedUser._id,
                userType: selectedUser.userType,
                month: currentMonth.getMonth(),
                year: currentMonth.getFullYear(),
                baseSalary: monthlyBaseSalary,
                perDaySalary: parseFloat(perDaySalary.toFixed(2)),
                workingDays: stats.total,
                presentDays: stats.present,
                gracePresentDays: stats.gracePresent,
                earnedAmount: parseFloat(earnedAmount.toFixed(2)),
                remarkAmount: totalRemarkAmount,
                totalPayable: parseFloat(totalPayable.toFixed(2)),
                status: salaryStatus,
                notes: JSON.stringify(remarksList.filter(r => r.title || r.amount)),
                attendanceSummary,
                salarySummary: salarySummaryObj,
            };

            const response = await axios.post(\`\${import.meta.env.VITE_API_URL}/salary/save\`, salaryData);
            if (response.data.success) {
                alert("Salary summary saved successfully!");
                setRemarksList(prev => {
                    const valid = prev.filter(r => r.title || r.amount);
                    if (valid.length === 0) return [{ title: "", amount: "", type: "Amount", isSaved: false }];
                    return valid.map(r => ({ ...r, isSaved: true }));
                });
                setSavedSalarySummary(salaryData);
            } else {
                alert("Failed to save salary summary");
            }
        } catch (error) {
            console.error("Error saving salary summary:", error);
            alert("Error saving salary summary: " + error.message);
        } finally {
            setSavingSalary(false);
        }
    };\n`;

content = content.replace('    return (\n        <div className="flex w-full flex-col', saveFunc + '    return (\n        <div className="flex w-full flex-col');

// 4. Replace read-only Remarks with editable Remarks
const oldRemarks = `                                                        {/* Remarks List (If any) */}
                                                        {remarksList.length > 0 && (
                                                            <div className="rounded-lg border border-amber-200 bg-amber-50 p-3">
                                                                <h4 className="mb-2 text-xs font-semibold text-gray-700 uppercase tracking-wider">Adjustments</h4>
                                                                <div className="space-y-1">
                                                                    {remarksList.map((remark, idx) => {
                                                                        const isPercentage = remark.type === "Percentage";
                                                                        const effectiveAmount = isPercentage ? (monthlyBaseSalary * (Number(remark.amount) || 0)) / 100 : Number(remark.amount);
                                                                        return (
                                                                            <div key={idx} className="flex items-center justify-between text-sm">
                                                                                <span className="text-gray-700 font-medium">{remark.title || "Adjustment"}</span>
                                                                                <span className="font-bold text-gray-900">
                                                                                    {isPercentage ? \`\${remark.amount}% (₹\${effectiveAmount.toFixed(0)})\` : \`₹\${effectiveAmount.toFixed(0)}\`}
                                                                                </span>
                                                                            </div>
                                                                        );
                                                                    })}
                                                                </div>
                                                                <div className="mt-2 text-right border-t border-amber-200 pt-1 text-xs font-bold text-amber-800">
                                                                    Total Adjustments: ₹{totalRemarkAmount.toLocaleString()}
                                                                </div>
                                                            </div>
                                                        )}`;

const newRemarks = `                                                        {/* Editable Remarks / Adjustments */}
                                                        <div className="rounded-lg border border-amber-200 bg-amber-50 p-3">
                                                            <div className="mb-2 flex items-center justify-between">
                                                                <label className="text-xs font-medium text-gray-700">Remarks / Adjustments</label>
                                                                {(globalRole === "superadmin" || globalRole === "admin") && (
                                                                    <button
                                                                        onClick={() => setRemarksList([...remarksList, { title: "", amount: "", type: "Amount", isSaved: false }])}
                                                                        className="flex h-5 w-5 items-center justify-center rounded-full bg-amber-200 text-amber-800 hover:bg-amber-300 font-bold"
                                                                        title="Add Remark"
                                                                    >
                                                                        +
                                                                    </button>
                                                                )}
                                                            </div>
                                                            <div className="space-y-2">
                                                                {remarksList.map((remark, idx) => (
                                                                    <div key={idx} className="flex flex-wrap sm:flex-nowrap items-center gap-2">
                                                                        {(remark.isSaved || (globalRole !== "superadmin" && globalRole !== "admin")) ? (
                                                                            <>
                                                                                <div className="flex-1 rounded bg-amber-100 px-2 py-1 text-sm font-semibold text-amber-900 border border-amber-200">
                                                                                    {remark.title || "Adjustment"}
                                                                                </div>
                                                                                <div className="w-auto min-w-[6rem] rounded bg-amber-100 px-2 py-1 text-sm font-bold text-amber-900 border border-amber-200">
                                                                                    {remark.type === "Percentage" 
                                                                                        ? \`\${remark.amount}% (₹\${((monthlyBaseSalary * (Number(remark.amount) || 0)) / 100).toFixed(0)})\` 
                                                                                        : \`₹\${remark.amount || 0}\`}
                                                                                </div>
                                                                                {(globalRole === "superadmin" || globalRole === "admin") && (
                                                                                    <button
                                                                                        onClick={() => {
                                                                                            const newRemarks = [...remarksList];
                                                                                            newRemarks[idx].isSaved = false;
                                                                                            setRemarksList(newRemarks);
                                                                                        }}
                                                                                        className="text-blue-500 hover:text-blue-700 p-1"
                                                                                    >
                                                                                        <Edit2 size={16} />
                                                                                    </button>
                                                                                )}
                                                                            </>
                                                                        ) : (
                                                                            <>
                                                                                <input
                                                                                    type="text"
                                                                                    placeholder="Title"
                                                                                    value={remark.title}
                                                                                    onChange={(e) => {
                                                                                        const newRemarks = [...remarksList];
                                                                                        newRemarks[idx].title = e.target.value;
                                                                                        setRemarksList(newRemarks);
                                                                                    }}
                                                                                    className="flex-1 min-w-[120px] rounded border border-amber-300 px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
                                                                                />
                                                                                <select
                                                                                    value={remark.type || "Amount"}
                                                                                    onChange={(e) => {
                                                                                        const newRemarks = [...remarksList];
                                                                                        newRemarks[idx].type = e.target.value;
                                                                                        setRemarksList(newRemarks);
                                                                                    }}
                                                                                    className="w-[100px] rounded border border-amber-300 px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
                                                                                >
                                                                                    <option value="Amount">Amount</option>
                                                                                    <option value="Percentage">Percentage</option>
                                                                                </select>
                                                                                <input
                                                                                    type="number"
                                                                                    placeholder="Value"
                                                                                    value={remark.amount}
                                                                                    onChange={(e) => {
                                                                                        const newRemarks = [...remarksList];
                                                                                        newRemarks[idx].amount = e.target.value;
                                                                                        setRemarksList(newRemarks);
                                                                                    }}
                                                                                    className="w-[80px] sm:w-[100px] rounded border border-amber-300 px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
                                                                                />
                                                                                <button
                                                                                    onClick={() => {
                                                                                        const newRemarks = [...remarksList];
                                                                                        newRemarks.splice(idx, 1);
                                                                                        setRemarksList(newRemarks);
                                                                                    }}
                                                                                    className="text-red-500 hover:text-red-700 p-1"
                                                                                >
                                                                                    <Trash2 size={16} />
                                                                                </button>
                                                                            </>
                                                                        )}
                                                                    </div>
                                                                ))}
                                                            </div>
                                                            <div className="mt-2 text-right border-t border-amber-200 pt-1 text-xs font-bold text-amber-800">
                                                                Total Adjustments: ₹{totalRemarkAmount.toLocaleString()}
                                                            </div>
                                                        </div>`;

// Remove local static remarksList
content = content.replace(/let remarksList = \[\];[\s\S]*?const totalRemarkAmount = remarksList\.reduce/m, 'const totalRemarkAmount = remarksList.reduce');

content = content.replace(oldRemarks, newRemarks);

// 5. Add Save Button below Final Payable
const oldPayable = `                                                        {/* Final Payable */}
                                                        <div className="rounded-lg border-2 border-emerald-700 bg-gradient-to-r from-emerald-500 to-green-600 p-2 text-white sm:p-2.5 md:p-3">
                                                            <div className="flex items-center justify-between gap-2">
                                                                <span className="text-sm font-bold sm:text-sm md:text-sm">Payable</span>
                                                                <span className="text-lg font-bold sm:text-base md:text-lg">
                                                                    ₹{finalPayable.toLocaleString("en-IN", { maximumFractionDigits: 0 })}
                                                                </span>
                                                            </div>
                                                        </div>`;

const newPayable = oldPayable + `
                                                        {/* Admin Controls */}
                                                        {(globalRole === "superadmin" || globalRole === "admin") && (
                                                            <div className="mt-4 flex flex-col gap-3 rounded-lg border border-gray-200 bg-gray-50 p-4">
                                                                <div className="flex items-center justify-between">
                                                                    <label className="text-sm font-semibold text-gray-700">Salary Status</label>
                                                                    <select
                                                                        value={salaryStatus}
                                                                        onChange={(e) => setSalaryStatus(e.target.value)}
                                                                        className="rounded-md border-gray-300 p-2 text-sm shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                                                    >
                                                                        <option value="Pending">Pending</option>
                                                                        <option value="Paid">Paid</option>
                                                                        <option value="Hold">Hold</option>
                                                                    </select>
                                                                </div>
                                                                <button
                                                                    onClick={() => saveSalarySummary(monthlyBaseSalary, perDaySalary, stats, earnedAmount, totalRemarkAmount, finalPayable)}
                                                                    disabled={savingSalary}
                                                                    className={\`w-full rounded-md py-2 font-semibold text-white transition-colors \${
                                                                        savingSalary ? "cursor-not-allowed bg-blue-400" : "bg-blue-600 hover:bg-blue-700"
                                                                    }\`}
                                                                >
                                                                    {savingSalary ? "Saving..." : "Save Salary Summary"}
                                                                </button>
                                                            </div>
                                                        )}`;

content = content.replace(oldPayable, newPayable);

fs.writeFileSync(filePath, content, 'utf-8');
console.log('SUCCESS');
