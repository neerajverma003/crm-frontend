import React from 'react';

const AddSalary = ({ goBack }) => {
  const handleCancel = () => {
    if (goBack) {
      goBack();
    }
  };

  return (
    <div className="pb-4" style={{ overflow: 'auto' }}>
      <div className="container-fluid py-2" style={{ color: 'var(--secondaryDashColorDark)' }}>
        <div className="my-auto mt-2">
          <div className="d-flex align-items-center gap-2">
            <h5 className="m-0 p-0 text-capitalize" style={{ fontWeight: 500, color: 'var(--PrimaryColorDark)' }}>
              Add Salary Details
            </h5>
          </div>
          <p className="m-0" style={{ color: 'var(--Subtittles)' }}>
            You can add salary details of the employee.
          </p>
        </div>

        <form id="form" className="w-100 row row-gap-3 py-4 mb-5" style={{ width: 'fit-content' }}>
          <div className="col-12 col-md-6 col-lg-4">
            <label>Select Employee</label>
            <div>
              <select
                name="employeeId"
                required
                className="form-select text-capitalize ms-0 ms-md-auto rounded-2 bg-light text-dark border dark-placeholder form-control"
              >
                <option value="" disabled>Select your option</option>
                <option value="66ebeb5030112f29b4c0b811">DEMO0001 - Admin Admin</option>
                <option value="67ce6c877958c20b965c5852">DEMO0010 - demo emp2</option>
                <option value="67ce70367958c20b965c67c6">DEMO0011 - Rahul Sharma</option>
                <option value="67ce85327958c20b965d25fd">DEMO0012 - Deepak Kumar</option>
                <option value="67d7e176eaef720b2d445ea4">DEMO0013 - faiz alam</option>
                <option value="68032df4d2d0180a381ae7ab">DEMO0014 - Demo Employee</option>
                <option value="6810add4d2d0180a3829fe16">DEMO0015 - Sachin Sachin</option>
                <option value="6810c213d2d0180a382a2c5f">DEMO0017 - Sachin Sahoo</option>
                <option value="6813052fd2d0180a382c96b8">DEMO0018 - tertr trwe</option>
                <option value="6810aec7d2d0180a382a000d">DEMO0016 - Alok gupta ( Inactive )</option>
              </select>
            </div>
          </div>

          <div className="col-12 col-md-6 col-lg-4">
            <label>Basic Salary</label>
            <div>
              <input
                name="BasicSalary"
                placeholder="Basic Salary"
                required
                type="number"
                className="form-control ms-0 ms-md-auto rounded-2 bg-light text-dark border dark-placeholder form-control"
                value=""
              />
            </div>
          </div>

          <div className="col-12 col-md-6 col-lg-4">
            <label>House Rent Allowance (H.R.A.)</label>
            <div>
              <input
                name="HRASalary"
                placeholder="H.R.A"
                required
                type="number"
                className="form-control ms-0 ms-md-auto rounded-2 bg-light text-dark border dark-placeholder form-control"
                value=""
              />
            </div>
          </div>

          <div className="col-12 col-md-6 col-lg-4">
            <label>Convenyance Allowance</label>
            <div>
              <input
                name="ConvenyanceAllowance"
                placeholder="Convenyance Allowance"
                required
                type="number"
                className="form-control ms-0 ms-md-auto rounded-2 bg-light text-dark border dark-placeholder form-control"
                value=""
              />
            </div>
          </div>

          <div className="col-12 col-md-6 col-lg-4">
            <label>Other Allowance</label>
            <div>
              <input
                name="otherAllowance"
                placeholder="Other Allowance"
                required
                type="number"
                className="form-control ms-0 ms-md-auto rounded-2 bg-light text-dark border dark-placeholder form-control"
                value=""
              />
            </div>
          </div>

          <div className="col-12 col-md-6 col-lg-4">
            <label>Total Salary</label>
            <div>
              <input
                name="totalSalary"
                placeholder="Total Earning"
                type="number"
                readOnly
                className="form-control ms-0 ms-md-auto rounded-2 bg-light text-dark border dark-placeholder form-control"
                value=""
              />
            </div>
          </div>

          <div className="d-flex align-items-center gap-3">
            <button type="submit" className="btn btn-primary">
              Submit
            </button>
            <button
  type="button"
  className="btn btn-danger"
  onClick={handleCancel}
  style={{ color: 'white' }}
>
  Cancel
</button>

          </div>

          <div className="form-group col-12 col-md-6" id="form-cancel-button"></div>
        </form>
      </div>
    </div>
  );
};

export default AddSalary;