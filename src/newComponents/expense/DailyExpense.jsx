import React, { useState, useEffect } from "react";
import { X } from "lucide-react";

const DailyExpense = () => {
    const [showModal, setShowModal] = useState(false);
    const [formData, setFormData] = useState({
        amount: "",
        reason: "",
        paymentMethod: "",
        date: "",
        bill: null,
    });
    const [expenses, setExpenses] = useState([]);
    const [viewBillUrl, setViewBillUrl] = useState(null); // For viewing bill

    // Fetch all expenses
    const fetchExpenses = async () => {
        try {
            const response = await fetch("http://localhost:4000/expense/all");
            const data = await response.json();
            if (response.ok) {
                setExpenses(data);
            } else {
                console.error("Failed to fetch expenses:", data.message);
            }
        } catch (error) {
            console.error("Error fetching expenses:", error);
        }
    };

    useEffect(() => {
        fetchExpenses();
    }, []);

    const handleChange = (e) => {
        const { name, value, files } = e.target;
        if (name === "bill") {
            setFormData({ ...formData, bill: files[0] });
        } else {
            setFormData({ ...formData, [name]: value });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const data = new FormData();
            data.append("AmountPaid", formData.amount);
            data.append("reason", formData.reason);
            data.append("PaymentMethod", formData.paymentMethod);
            data.append("date", formData.date);
            if (formData.bill) {
                data.append("bill", formData.bill);
            }

            const response = await fetch("http://localhost:4000/expense", {
                method: "POST",
                body: data,
            });

            const result = await response.json();

            if (response.ok) {
                alert("Expense submitted successfully!");
                setShowModal(false);
                setFormData({
                    amount: "",
                    reason: "",
                    paymentMethod: "",
                    date: "",
                    bill: null,
                });
                fetchExpenses(); // Refresh list
            } else {
                console.error("Error:", result.message);
            }
        } catch (error) {
            console.error("Error submitting expense:", error);
        }
    };

    // Function to view bill
    const handleViewBill = (billUrl) => {
        setViewBillUrl(billUrl);
    };

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <div className="rounded-md border border-gray-300 bg-white p-4">
                    <div className="mb-1 text-lg font-semibold text-gray-800">Today Expense</div>
                    <div className="text-2xl font-bold text-black">₹100</div>
                </div>
                <div className="rounded-md border border-gray-300 bg-white p-4">
                    <div className="mb-1 text-lg font-semibold text-gray-800">Monthly Expense</div>
                    <div className="text-2xl font-bold text-black">₹3000</div>
                </div>
            </div>

            <div className="mb-4 flex items-center justify-between">
                <h2 className="text-xl font-semibold">Daily Expenses</h2>
                <button
                    onClick={() => setShowModal(true)}
                    className="flex items-center gap-2 text-nowrap rounded-lg bg-black px-3 py-1.5 text-sm font-medium text-white hover:bg-gray-800 sm:px-4 sm:py-2 sm:text-base"
                >
                    + Add Expense
                </button>
            </div>

            <div className="overflow-x-auto rounded-lg border bg-white shadow-md">
                <table className="min-w-full border-collapse">
                    <thead className="border-b bg-gray-100">
                        <tr>
                            <th className="p-3 text-left text-sm font-semibold text-gray-600">Date</th>
                            <th className="p-3 text-left text-sm font-semibold text-gray-600">Reason</th>
                            <th className="p-3 text-left text-sm font-semibold text-gray-600">Payment Method</th>
                            <th className="p-3 text-left text-sm font-semibold text-gray-600">Amount</th>
                            <th className="p-3 text-left text-sm font-semibold text-gray-600">Bill</th>
                        </tr>
                    </thead>
                    <tbody>
                        {expenses.length > 0 ? (
                            expenses.map((exp) => {
                                const formattedDate = new Date(exp.date).toLocaleDateString("en-US", {
                                    weekday: "short",
                                    year: "numeric",
                                    month: "short",
                                    day: "numeric",
                                });

                                return (
                                    <tr
                                        key={exp._id}
                                        className="border-b hover:bg-gray-50"
                                    >
                                        <td className="p-3 text-sm text-gray-800">{formattedDate}</td>
                                        <td className="p-3 text-sm text-gray-800">{exp.reason}</td>
                                        <td className="p-3 text-sm text-gray-800">{exp.PaymentMethod}</td>
                                        <td className="p-3 text-sm text-gray-800">₹{exp.AmountPaid}</td>
                                        <td className="cursor-pointer p-3 text-sm text-blue-600">
                                            {exp.bill ? (
                                                <button
                                                    onClick={() => handleViewBill(exp.bill)} // ✅ Use Cloudinary URL directly
                                                    className="underline"
                                                >
                                                    View
                                                </button>
                                            ) : (
                                                "-"
                                            )}
                                        </td>
                                    </tr>
                                );
                            })
                        ) : (
                            <tr>
                                <td
                                    colSpan="5"
                                    className="p-3 text-center text-gray-500"
                                >
                                    No expenses found.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Add Expense Modal */}
            {showModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="w-full max-w-2xl rounded-2xl bg-white p-6 shadow-xl">
                        <div className="mb-4 flex items-center justify-between">
                            <h2 className="text-xl font-semibold">Add Daily Expense</h2>
                            <button
                                onClick={() => setShowModal(false)}
                                className="text-gray-500 hover:text-gray-700"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        <form
                            onSubmit={handleSubmit}
                            className="space-y-4"
                        >
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Amount Paid</label>
                                    <input
                                        type="number"
                                        name="amount"
                                        value={formData.amount}
                                        onChange={handleChange}
                                        placeholder="Enter amount"
                                        required
                                        className="mt-1 w-full rounded-lg border p-2 focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Payment Method</label>
                                    <select
                                        name="paymentMethod"
                                        value={formData.paymentMethod}
                                        onChange={handleChange}
                                        required
                                        className="mt-1 w-full rounded-lg border bg-white p-2 focus:ring-2 focus:ring-blue-500"
                                    >
                                        <option value="">Select method</option>
                                        <option value="Cash">Cash</option>
                                        <option value="UPI">UPI</option>
                                        <option value="Card">Card</option>
                                        <option value="Bank Transfer">Bank Transfer</option>
                                    </select>
                                </div>
                                <div className="col-span-2">
                                    <label className="block text-sm font-medium text-gray-700">Reason</label>
                                    <textarea
                                        name="reason"
                                        value={formData.reason}
                                        onChange={handleChange}
                                        placeholder="Enter reason for payment"
                                        required
                                        rows="2"
                                        className="mt-1 w-full resize-none rounded-lg border p-2 focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Date</label>
                                    <input
                                        type="date"
                                        name="date"
                                        value={formData.date}
                                        onChange={handleChange}
                                        required
                                        className="mt-1 w-full rounded-lg border p-2 focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Attach Bill</label>
                                    <input
                                        type="file"
                                        name="bill"
                                        accept="image/*"
                                        onChange={handleChange}
                                        className="mt-1 w-full rounded-lg border p-2 focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>
                            </div>
                            <div className="mt-6 flex justify-end gap-3">
                                <button
                                    type="button"
                                    onClick={() => setShowModal(false)}
                                    className="rounded-lg border border-gray-300 px-4 py-2 text-gray-700 hover:bg-gray-100"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="rounded-lg bg-black px-4 py-2 text-white hover:bg-gray-800"
                                >
                                    Add Expense
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* View Bill Modal */}
            {viewBillUrl && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70">
                    <div className="relative w-full max-w-lg rounded-xl bg-white p-4">
                        <button
                            className="absolute right-2 top-2 text-gray-500 hover:text-gray-700"
                            onClick={() => setViewBillUrl(null)}
                        >
                            <X size={24} />
                        </button>
                        <img
                            src={viewBillUrl}
                            alt="Bill"
                            className="h-auto w-full rounded"
                        />
                    </div>
                </div>
            )}
        </div>
    );
};

export default DailyExpense;
