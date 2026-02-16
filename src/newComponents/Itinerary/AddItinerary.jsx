import React, { useState, useEffect } from "react";
import { Upload, FileText, X } from "lucide-react";
import axios from "axios";

function AddItinerary() {
  const [destinations, setDestinations] = useState([]);
  const [selectedDestination, setSelectedDestination] = useState("");
  const [numberOfDays, setNumberOfDays] = useState("");
  const [uploadedFile, setUploadedFile] = useState(null);
  const [travelType, setTravelType] = useState('domestic'); // 'domestic' | 'international'
  const [loading, setLoading] = useState(false);



  const days = Array.from({ length: 30 }, (_, i) => i + 1);

  // ============================================================
  // FETCH DESTINATIONS FROM API
  // ============================================================
  useEffect(() => {
    axios
      .get("http://localhost:4000/employeeDestination/")
      .then((res) => {
        console.log("Destination API Response:", res.data);

        // FIXED according to your API structure
        if (res.data.destinations) {
          setDestinations(res.data.destinations);
        }
      })
      .catch((err) => {
        console.log("Error fetching destinations", err);
      });
  }, []);

  // ============================================================
  // HANDLE PDF UPLOAD
  // ============================================================
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type === "application/pdf") {
      setUploadedFile(file);
    } else {
      alert("Please upload a valid PDF file.");
    }
  };

  const handleRemoveFile = () => {
    setUploadedFile(null);
  };

  // ============================================================
  // SUBMIT FORM (POST API)
  // ============================================================
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    console.log("cliked");

    if (!selectedDestination || !numberOfDays || !uploadedFile || !travelType) {
      alert("Please fill all fields before submitting.");
      return;
    }

    const formData = new FormData();
    formData.append("Destination", selectedDestination);
    formData.append("NoOfDay", numberOfDays);
    formData.append("Upload", uploadedFile);
    formData.append("TravelType", travelType);


    try {
      const res = await axios.post(
        "http://localhost:4000/itinerary/create",
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      if (res.data.success) {
        setLoading(false)
        alert("Itinerary added successfully!");

        // Reset form
        setSelectedDestination("");
        setNumberOfDays("");
        setUploadedFile(null);
      }
    } catch (error) {
      console.error("Error saving itinerary:", error);
      alert("Failed to save itinerary.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl p-8 border-2 border-gray-800">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">
            Add Itinerary
          </h1>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Destination Dropdown */}
            <div>

              {/* Radio Buttons */}
              <div className="mb-4">
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  Travel Type
                </label>

                <div className="flex gap-6">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="travelType"
                      value="domestic"
                      checked={travelType === 'domestic'}
                      onChange={() => setTravelType('domestic')}
                      className="accent-gray-900"
                    />
                    <span className="text-sm font-medium text-gray-800">
                      Domestic
                    </span>
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="travelType"
                      value="international"
                      checked={travelType === 'international'}
                      onChange={() => setTravelType('international')}
                      className="accent-gray-900"
                    />
                    <span className="text-sm font-medium text-gray-800">
                      International
                    </span>
                  </label>
                </div>
              </div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                Select Destination
              </label>
              <select
                value={selectedDestination}
                onChange={(e) => setSelectedDestination(e.target.value)}
                className="w-full px-4 py-3 border-2 border-gray-800 rounded-lg"
              >
                <option value="">Choose a destination...</option>

                {destinations.map((dest) => (
                  <option key={dest._id} value={dest.destination}>
                    {dest.destination}
                  </option>
                ))}
              </select>
            </div>

            {/* Number of Days */}
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                Number of Days
              </label>
              <select
                value={numberOfDays}
                onChange={(e) => setNumberOfDays(e.target.value)}
                className="w-full px-4 py-3 border-2 border-gray-800 rounded-lg"
              >
                <option value="">Select number of days...</option>

                {days.map((day) => (
                  <option key={day} value={day}>
                    {day} {day === 1 ? "Day" : "Days"}
                  </option>
                ))}
              </select>
            </div>

            {/* PDF Upload */}
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                Upload Itinerary PDF
              </label>

              {!uploadedFile ? (
                <div className="border-2 border-dashed border-gray-800 p-8 rounded-lg text-center">
                  <input
                    type="file"
                    id="pdf-upload"
                    accept=".pdf"
                    className="hidden"
                    onChange={handleFileChange}
                  />
                  <label
                    htmlFor="pdf-upload"
                    className="cursor-pointer flex flex-col items-center"
                  >
                    <div className="bg-gray-900 p-4 rounded-full mb-4">
                      <Upload className="w-8 h-8 text-white" />
                    </div>
                    <p className="font-semibold text-gray-900">
                      Click to upload PDF
                    </p>
                  </label>
                </div>
              ) : (
                <div className="border-2 border-gray-800 rounded-lg p-4 bg-gray-50">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <FileText className="w-6 h-6 text-gray-900" />
                      <div>
                        <p className="font-semibold">{uploadedFile.name}</p>
                        <p className="text-sm text-gray-600">
                          {(uploadedFile.size / 1024).toFixed(2)} KB
                        </p>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={handleRemoveFile}
                      className="p-2 hover:bg-gray-200 rounded-lg"
                    >
                      <X className="w-5 h-5 text-gray-900" />
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              // className="w-full bg-gray-900 text-white py-3 rounded-lg border-2 border-gray-900 hover:bg-gray-800"
              className={`w-full py-3 rounded-lg border-2 transition 
    ${loading
                  ? 'bg-gray-400 text-gray-700 border-gray-400 cursor-not-allowed opacity-70'
                  : 'bg-gray-900 text-white border-gray-900 hover:bg-gray-800'}
  `}
            >
              {loading ? "Uploading..." : "Add Itinerary"}
            </button>
          </form>
        </div>
      </div>

      {/* {loading && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <p className="text-lg font-semibold">Uploading...</p>
          </div>
        </div>
      )} */}
    </div>
  );
}

export default AddItinerary;
