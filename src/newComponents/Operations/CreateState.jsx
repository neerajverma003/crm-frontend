import React, { useState, useEffect } from "react";

const CreateState = () => {
  const [stateType, setStateType] = useState("Domestic"); // Default to Domestic
  const [formData, setFormData] = useState({
    countryName: "India",
    stateName: "",
  });
  const [filterType, setFilterType] = useState("All");
  const [states, setStates] = useState([]); // ✅ store fetched states

  // ✅ Fetch states from backend
  const fetchStates = async () => {
    try {
      const res = await fetch("http://localhost:4000/state/");
      if (!res.ok) throw new Error("Failed to fetch states");
      const data = await res.json();
      setStates(data); // update state
    } catch (error) {
      console.error("Error fetching states:", error);
    }
  };

  useEffect(() => {
    fetchStates();
  }, []);

  // ✅ Handle Checkbox Change
  const handleCheckboxChange = (type) => {
    setStateType(type);
    setFormData({
      countryName: type === "Domestic" ? "India" : "",
      stateName: "",
    });
  };

  // ✅ Handle Input Change
  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // ✅ Handle Submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.countryName || !formData.stateName) {
      alert("Please fill all fields");
      return;
    }

    const payload = {
      type: stateType,
      country: formData.countryName,
      state: formData.stateName,
    };

    try {
      const res = await fetch("http://localhost:4000/state/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error("Failed to save state");

      const savedState = await res.json();

      alert("State saved successfully ✅");

      // Reset form
      setFormData({
        countryName: stateType === "Domestic" ? "India" : "",
        stateName: "",
      });

      // Update table immediately
      setStates((prev) => [...prev, savedState]);
    } catch (error) {
      console.error("Error saving state:", error);
      alert("Failed to save state");
    }
  };

  // ✅ Filter data
  const filteredData =
    filterType === "All"
      ? states
      : states.filter((d) => d.type === filterType);

  return (
    <div className="max-w-7xl mx-auto mt-10 bg-white p-8 rounded-lg shadow-md">
      <h2 className="text-2xl font-semibold mb-5 text-left">Create State</h2>

      {/* ✅ Type Checkboxes */}
      <div className="flex gap-6 mb-6 justify-left">
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={stateType === "Domestic"}
            onChange={() => handleCheckboxChange("Domestic")}
          />
          Domestic
        </label>

        <label className="flex items-left gap-2">
          <input
            type="checkbox"
            checked={stateType === "International"}
            onChange={() => handleCheckboxChange("International")}
          />
          International
        </label>
      </div>

      {/* ✅ Form */}
      <form onSubmit={handleSubmit} className="space-y-4 max-w-7xl ">
        {stateType === "Domestic" && (
          <>
            <div>
              <label className="block text-sm font-medium mb-1">
                Country Name
              </label>
              <input
                type="text"
                name="countryName"
                value="India"
                readOnly
                className="w-full  border border-gray-300 rounded-md p-2 bg-gray-100 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                State Name
              </label>
              <input
                type="text"
                name="stateName"
                value={formData.stateName}
                onChange={handleInputChange}
                placeholder="Enter state name"
                className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-black"
              />
            </div>
          </>
        )}

        {stateType === "International" && (
          <>
            <div>
              <label className="block text-sm font-medium mb-1">
                Country Name
              </label>
              <input
                type="text"
                name="countryName"
                value={formData.countryName}
                onChange={handleInputChange}
                placeholder="Enter country name"
                className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-black"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                State Name
              </label>
              <input
                type="text"
                name="stateName"
                value={formData.stateName}
                onChange={handleInputChange}
                placeholder="Enter state name"
                className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-black"
              />
            </div>
          </>
        )}

        <button
          type="submit"
          className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-2 rounded-md transition-colors"
        >
          Save State
        </button>
      </form>

      {/* ✅ Table Section */}
      <div className="mt-10">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">State List</h3>

          {/* Filter Buttons */}
          <div className="flex gap-2">
            <button
              onClick={() => setFilterType("All")}
              className={`px-4 py-1 rounded-md border ${
                filterType === "All"
                  ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-white"
                  : "bg-white text-black border-gray-300"
              }`}
            >
              All
            </button>
            <button
              onClick={() => setFilterType("Domestic")}
              className={`px-4 py-1 rounded-md border ${
                filterType === "Domestic"
                  ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-white"
                  : "bg-white text-black border-gray-300"
              }`}
            >
              Domestic
            </button>
            <button
              onClick={() => setFilterType("International")}
              className={`px-4 py-1 rounded-md border ${
                filterType === "International"
                  ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-white"
                  : "bg-white text-black border-gray-300"
              }`}
            >
              International
            </button>
          </div>
        </div>

        {/* ✅ Table */}
        <div className="overflow-x-auto">
          <table className="w-full border border-gray-200 text-sm">
            <thead className="bg-gray-100">
              <tr>
                <th className="border border-gray-200 px-4 py-2 text-left">#</th>
                <th className="border border-gray-200 px-4 py-2 text-left">
                  Type
                </th>
                <th className="border border-gray-200 px-4 py-2 text-left">
                  Country
                </th>
                <th className="border border-gray-200 px-4 py-2 text-left">
                  State
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredData.length > 0 ? (
                filteredData.map((d, index) => (
                  <tr key={d._id || index} className="hover:bg-gray-50">
                    <td className="border border-gray-200 px-4 py-2">
                      {index + 1}
                    </td>
                    <td className="border border-gray-200 px-4 py-2">{d.type}</td>
                    <td className="border border-gray-200 px-4 py-2">{d.country}</td>
                    <td className="border border-gray-200 px-4 py-2">{d.state}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="4"
                    className="text-center text-gray-500 py-4 border border-gray-200"
                  >
                    No states found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default CreateState;
