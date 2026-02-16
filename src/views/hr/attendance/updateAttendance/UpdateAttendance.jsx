import React from "react";

const EMAIL_OPTIONS = [
  "demo.manager@munc.in",
  "demo.employee@munc.in",
  "amar@gmail.com",
  "kumar@gmail.com",
  "akash@gmail.com",
  "rahulsharma@gmail.com",
  "deepak@gmail.com",
  "faiz@munc.in",
  "demo.employee2@munc.in",
  "aloke@gmail.com",
  "sachin12@gmail.com",
];

const UpdateAttendance = () => {
  return (
    <div className="container-fluid mt-4">
      <header className="card-header mb-3">
        <div className="my-auto mt-2">
          <h5 className="m-0 p-0 text-capitalize fw-medium text-primary-dark">
            Update Attendance
          </h5>
          <p className="m-0 text-subtitle">
            You can update user attendance here.
          </p>
        </div>
      </header>

      <div className="card-body text-dark">
        <form className="row row-gap-3">
          {/* Email Select */}
          <div className="col-12 col-md-6">
            <label htmlFor="Email" className="form-label">
              Select Email:
            </label>
            <select
              id="Email"
              name="Email"
              className="form-select rounded-2 bg-light text-dark border dark-placeholder"
              required
            >
              <option value="" disabled>
                Select an email
              </option>
              {EMAIL_OPTIONS.map((email) => (
                <option key={email} value={email}>
                  {email}
                </option>
              ))}
            </select>
          </div>

          {/* Date */}
          <div className="col-12 col-md-6">
            <label htmlFor="date" className="form-label">
              Date:
            </label>
            <input
              type="date"
              id="date"
              name="date"
              className="form-control rounded-2 bg-light text-dark border dark-placeholder"
              min="2025-04-28"
              max="2025-04-30"
              required
              defaultValue="2025-04-30"
            />
          </div>

          {/* Login Time */}
          <div className="col-12 col-md-6">
            <label htmlFor="loginTime" className="form-label">
              Login Time:
            </label>
            <input
              type="time"
              id="loginTime"
              name="loginTime"
              className="form-control rounded-2 bg-light text-dark border dark-placeholder"
            />
          </div>

          {/* Logout Time */}
          <div className="col-12 col-md-6">
            <label htmlFor="logoutTime" className="form-label">
              Logout Time:
            </label>
            <input
              type="time"
              id="logoutTime"
              name="logoutTime"
              className="form-control rounded-2 bg-light text-dark border dark-placeholder"
            />
          </div>

          {/* Remark */}
          <div className="col-12">
            <label htmlFor="remark" className="form-label">
              Remark:
            </label>
            <textarea
              id="remark"
              name="remark"
              className="form-control rounded-2 bg-light text-dark border dark-placeholder"
              rows="3"
            ></textarea>
          </div>

          {/* Submit */}
          <div className="col-12">
            <button type="submit" className="btn btn-primary">
              Update Attendance
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
export default UpdateAttendance;
