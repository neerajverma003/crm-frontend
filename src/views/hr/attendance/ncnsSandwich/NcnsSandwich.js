import React, { useState, useEffect } from "react";

// ✅ Extract static data outside component
const EMPLOYEES = [
  { id: "66ebeb5030112f29b4c0b811", name: "Admin Admin", code: "DEMO0001" },
  { id: "67c68f0ba06d030b25201abf", name: "Hr Manager", code: "DEMO0002" },
  // ... other employees
];

const YEARS = [2024, 2025];

const MONTHS = [
  { value: "01", name: "January" },
  { value: "02", name: "February" },
  { value: "03", name: "March" },
  { value: "04", name: "April" },
  { value: "05", name: "May" },
  { value: "06", name: "June" },
  { value: "07", name: "July" },
  { value: "08", name: "August" },
  { value: "09", name: "September" },
  { value: "10", name: "October" },
  { value: "11", name: "November" },
  { value: "12", name: "December" },
];

const NcnsSandwich = () => {
  const [formData, setFormData] = useState({
    isNCNS: false,
    isSandwich: false,
    employeeObjID: "",
    year: "",
    month: "",
    date: "",
  });
  const [dates, setDates] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");

  // ✅ Derived state: form validity
  const isFormValid =
    (formData.isNCNS || formData.isSandwich) &&
    formData.employeeObjID &&
    formData.year &&
    formData.month &&
    formData.date;

  // ✅ Update available dates when year/month changes
  useEffect(() => {
    if (formData.year && formData.month) {
      const daysInMonth = new Date(formData.year, formData.month, 0).getDate();
      const newDates = Array.from({ length: daysInMonth }, (_, i) => ({
        value: String(i + 1),
        name: i + 1,
      }));
      setDates(newDates);
    } else {
      setDates([]);
    }
    // reset date if month/year changes
    setFormData((prev) => ({ ...prev, date: "" }));
  }, [formData.year, formData.month]);

  // ✅ Checkbox handler (only one active at a time)
  const handleCheckboxChange = (e) => {
    const { name, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      isNCNS: name === "isNCNS" ? checked : false,
      isSandwich: name === "isSandwich" ? checked : false,
    }));
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!isFormValid) {
      setErrorMessage("Please fill all required fields");
      return;
    }
    console.log("✅ Form submitted:", formData);
    setErrorMessage("");
    // API call or reset form here
  };

  return (
    <div className="container-fluid">
      {/* Header */}
      <div className="mb-3 mt-2">
        <h5 className="m-0 p-0 text-capitalize fw-medium text-primary-dark">
          NCNS and Sandwich Controller
        </h5>
        <p className="m-0 text-subtitle">
          You can mark NCNS and Sandwich to the employee attendance.
        </p>
      </div>

      {/* Form */}
      <form
        className="row row-gap-4 mx-auto rounded-2 p-4 px-1 shadow-sm text-black"
        style={{ background: "var(--primaryDashMenuColor)" }}
        onSubmit={handleSubmit}
      >
        {/* Checkboxes */}
        <div className="col-12 d-flex align-items-center gap-3">
          {["isNCNS", "isSandwich"].map((field) => (
            <label
              key={field}
              className="form-switch d-flex align-items-center my-auto"
            >
              <input
                type="checkbox"
                className="form-check-input"
                name={field}
                style={{ height: "1.5rem", width: "2.8rem" }}
                checked={formData[field]}
                onChange={handleCheckboxChange}
              />
              <span className="mx-3">
                {field === "isNCNS" ? "NCNS" : "Sandwich"}
              </span>
            </label>
          ))}
          <p className="m-0 badge-warning">
            You can select only one: Either NCNS or Sandwich Leave.
          </p>
        </div>

        {/* Employee */}
        <div className="col-12">
          <select
            className="form-select rounded-2 bg-light text-dark border dark-placeholder"
            name="employeeObjID"
            value={formData.employeeObjID}
            onChange={handleInputChange}
            required
          >
            <option value="">Select Employee</option>
            {EMPLOYEES.map((emp) => (
              <option key={emp.id} value={emp.id}>
                {emp.name} ({emp.code})
              </option>
            ))}
          </select>
        </div>

        {/* Year, Month, Date */}
        <div className="col-12 col-md-6 col-lg-4">
          <select
            name="year"
            className="form-select rounded-2 bg-light text-dark border dark-placeholder"
            value={formData.year}
            onChange={handleInputChange}
            required
          >
            <option value="">Select Year</option>
            {YEARS.map((year) => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </select>
        </div>

        <div className="col-12 col-md-6 col-lg-4">
          <select
            name="month"
            className="form-select rounded-2 bg-light text-dark border dark-placeholder"
            value={formData.month}
            onChange={handleInputChange}
            required
            disabled={!formData.year}
          >
            <option value="">Select Month</option>
            {MONTHS.map((month) => (
              <option key={month.value} value={month.value}>
                {month.name}
              </option>
            ))}
          </select>
        </div>

        <div className="col-12 col-md-6 col-lg-4">
          <select
            name="date"
            className="form-select rounded-2 bg-light text-dark border dark-placeholder"
            value={formData.date}
            onChange={handleInputChange}
            required
            disabled={!formData.month}
          >
            <option value="">Select Date</option>
            {dates.map((date) => (
              <option key={date.value} value={date.value}>
                {date.name}
              </option>
            ))}
          </select>
        </div>

        {/* Submit */}
        <div className="col-12 position-relative">
          <button
            className="btn btn-primary mt-3"
            type="submit"
            disabled={!isFormValid}
          >
            {isFormValid ? "Submit" : "Select Required Fields"}
          </button>
          {errorMessage && (
            <span className="text-danger position-absolute" style={{ top: "-2rem" }}>
              {errorMessage}
            </span>
          )}
        </div>
      </form>
    </div>
  );
};

export default NcnsSandwich;
