import React, { useState, useEffect } from "react";
import "./LeaveForm.css";

const leaveTypeMap = {
    "Sick Leave": "Sick Leave (Paid)",
    "Casual Leave": "Casual Leave (Paid)",
    "Paid Leave": "Emergency Leave (Paid)",
    "unPaid Leave": "Unpaid Leave",
    "Paternity Leave": "Paternity Leave (Paid)",
};

const today = new Date().toISOString().split("T")[0];

const LeaveForm = ({ onSubmit, onCancel, leaveBalance }) => {
    const [formData, setFormData] = useState({
        leaveType: "",
        startDate: today,
        endDate: today,
        additionalManager: "",
        reason: "",
    });

    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitMessage, setSubmitMessage] = useState({ type: "", text: "" });
    const [availableLeave, setAvailableLeave] = useState("");

    useEffect(() => {
        if (formData.leaveType) {
            const mappedType = leaveTypeMap[formData.leaveType];
            setAvailableLeave(mappedType && leaveBalance[mappedType] !== undefined ? `${leaveBalance[mappedType]} days available` : "Unlimited");
        } else {
            setAvailableLeave("");
        }
    }, [formData.leaveType, leaveBalance]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));

        if (errors[name]) {
            setErrors((prev) => {
                const newErrors = { ...prev };
                delete newErrors[name];
                return newErrors;
            });
        }
    };

    const validateForm = () => {
        const newErrors = {};
        if (!formData.leaveType) newErrors.leaveType = "Leave type is required";
        if (!formData.startDate) newErrors.startDate = "Start date is required";
        if (!formData.endDate) newErrors.endDate = "End date is required";
        if (!formData.reason) newErrors.reason = "Reason is required";

        const startDate = new Date(formData.startDate);
        const endDate = new Date(formData.endDate);
        if (startDate > endDate) {
            newErrors.dateRange = "End date cannot be before start date";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;

        setIsSubmitting(true);
        setSubmitMessage({ type: "", text: "" });

        try {
            const success = await onSubmit(formData);
            if (success) {
                setSubmitMessage({
                    type: "success",
                    text: "Leave application submitted successfully!",
                });
            }
        } catch (error) {
            setSubmitMessage({
                type: "error",
                text: error.message || "Failed to submit leave application",
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleReset = () => {
        setFormData({
            leaveType: "",
            startDate: today,
            endDate: today,
            additionalManager: "",
            reason: "",
        });
        setErrors({});
        setSubmitMessage({ type: "", text: "" });
        onCancel?.();
    };

    return (
        <div className="mainbar-grid">
            <div className="overflow-auto pb-4">
                <div className="container-fluid py2 text-primary">
                    <h5 className="fw-semibold mt-2">Create Leave</h5>
                    <p className="text-muted">You can create a new leave request here.</p>

                    {submitMessage.text && (
                        <div className={`alert ${submitMessage.type === "success" ? "alert-success" : "alert-danger"} mt-3`}>
                            {submitMessage.text}
                        </div>
                    )}

                    <form
                        className="row rounded py-4"
                        onSubmit={handleSubmit}
                    >
                        {/* Leave Type */}
                        <div className="col-12 mb-3">
                            <label
                                htmlFor="leaveType"
                                className="form-label"
                            >
                                Leave Type
                            </label>
                            <select
                                id="leaveType"
                                name="leaveType"
                                value={formData.leaveType}
                                onChange={handleChange}
                                className={`form-select rounded-2 bg-light text-dark border ${errors.leaveType ? "is-invalid" : ""}`}
                                required
                            >
                                <option
                                    value=""
                                    disabled
                                >
                                    -- Select Leave Type --
                                </option>
                                {Object.keys(leaveTypeMap).map((type) => (
                                    <option
                                        key={type}
                                        value={type}
                                    >
                                        {type}
                                    </option>
                                ))}
                            </select>
                            {errors.leaveType && <div className="invalid-feedback">{errors.leaveType}</div>}
                        </div>

                        {/* Available Leave */}
                        <div className="col-12 mb-3">
                            <label
                                htmlFor="leaveCount"
                                className="form-label"
                            >
                                Available
                            </label>
                            <input
                                id="leaveCount"
                                readOnly
                                disabled
                                value={formData.leaveType ? availableLeave : ""}
                                placeholder={formData.leaveType ? availableLeave : "Please select a leave type"}
                                className="form-control rounded-2 bg-light text-dark"
                            />
                        </div>

                        {/* Start Date */}
                        <div className="col-6 mb-3">
                            <label
                                htmlFor="startDate"
                                className="form-label"
                            >
                                Start Date
                            </label>
                            <input
                                type="date"
                                id="startDate"
                                name="startDate"
                                min={today}
                                value={formData.startDate}
                                onChange={handleChange}
                                className={`form-control rounded-2 bg-light text-dark ${errors.startDate ? "is-invalid" : ""}`}
                                required
                            />
                            {errors.startDate && <div className="invalid-feedback">{errors.startDate}</div>}
                        </div>

                        {/* End Date */}
                        <div className="col-6 mb-3">
                            <label
                                htmlFor="endDate"
                                className="form-label"
                            >
                                End Date
                            </label>
                            <input
                                type="date"
                                id="endDate"
                                name="endDate"
                                min={formData.startDate || today}
                                value={formData.endDate}
                                onChange={handleChange}
                                className={`form-control rounded-2 bg-light text-dark ${errors.endDate ? "is-invalid" : ""}`}
                                required
                            />
                            {errors.endDate && <div className="invalid-feedback">{errors.endDate}</div>}
                            {errors.dateRange && <div className="invalid-feedback d-block">{errors.dateRange}</div>}
                        </div>

                        {/* Reason */}
                        <div className="position-relative mb-3">
                            <label
                                htmlFor="reason"
                                className="form-label"
                            >
                                Reason
                            </label>
                            <textarea
                                id="reason"
                                name="reason"
                                maxLength="100"
                                required
                                value={formData.reason}
                                onChange={handleChange}
                                className={`form-control rounded-2 bg-light text-dark ${errors.reason ? "is-invalid" : ""}`}
                                placeholder="Please mention the reason for leave"
                            />
                            <span className="char-count">{100 - formData.reason.length} characters</span>
                            {errors.reason && <div className="invalid-feedback">{errors.reason}</div>}
                        </div>

                        {/* Buttons */}
                        <div className="d-flex align-items-center gap-3">
                            <button
                                type="submit"
                                className="btn btn-primary"
                                disabled={isSubmitting}
                            >
                                {isSubmitting ? "Submitting..." : "Submit"}
                            </button>
                            <button
                                type="reset"
                                className="btn btn-danger text-white"
                                onClick={handleReset}
                                disabled={isSubmitting}
                            >
                                Cancel
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default LeaveForm;
