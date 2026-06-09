import React, { useState, useEffect, useRef } from "react";
import { Upload, FileText, X, ChevronDown } from "lucide-react";
import axios from "axios";

const CustomDropdown = ({ value, onChange, options, placeholder }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <div
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-700 flex justify-between items-center cursor-pointer hover:bg-white hover:border-indigo-300 transition-all"
      >
        <span>{value || placeholder}</span>
        <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${isOpen ? "rotate-180" : ""}`} />
      </div>
      
      {isOpen && (
        <div className="absolute z-50 w-full mt-2 bg-white border border-slate-200 rounded-xl shadow-xl max-h-60 overflow-y-auto overflow-x-hidden">
          <div 
            onClick={() => { onChange(""); setIsOpen(false); }}
            className="px-4 py-2.5 hover:bg-slate-50 cursor-pointer text-sm font-medium text-slate-500 border-b border-slate-100"
          >
            {placeholder}
          </div>
          {options.map((opt, idx) => (
            <div
              key={idx}
              onClick={() => { onChange(opt.value); setIsOpen(false); }}
              className={`px-4 py-2.5 hover:bg-indigo-50 cursor-pointer text-sm font-semibold transition-colors ${value === opt.value ? 'bg-indigo-50 text-indigo-700' : 'text-slate-700'}`}
            >
              {opt.label}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

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
      .get(`${import.meta.env.VITE_API_URL}/employeeDestination/`)
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
        `${import.meta.env.VITE_API_URL}/itinerary/create`,
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
    <div className="max-w-3xl mx-auto my-6 sm:my-10 px-4 sm:px-6 lg:px-8">
      <div className="bg-white shadow-sm border border-slate-200 rounded-3xl p-6 sm:p-10">
        <h1 className="text-3xl font-black text-slate-900 tracking-tight leading-tight drop-shadow-sm mb-2">
          Add Itinerary
        </h1>
          <p className="text-slate-500 font-medium mb-8">Upload and manage travel itineraries for your destinations.</p>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Travel Type */}
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-3">
                Travel Type
              </label>
              <div className="flex gap-6">
                <label className="flex items-center gap-2 cursor-pointer group">
                  <input
                    type="radio"
                    name="travelType"
                    value="domestic"
                    checked={travelType === 'domestic'}
                    onChange={() => setTravelType('domestic')}
                    className="w-4 h-4 text-indigo-600 border-gray-300 focus:ring-indigo-500"
                  />
                  <span className="text-sm font-semibold text-slate-700 group-hover:text-indigo-600 transition-colors">
                    Domestic
                  </span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer group">
                  <input
                    type="radio"
                    name="travelType"
                    value="international"
                    checked={travelType === 'international'}
                    onChange={() => setTravelType('international')}
                    className="w-4 h-4 text-indigo-600 border-gray-300 focus:ring-indigo-500"
                  />
                  <span className="text-sm font-semibold text-slate-700 group-hover:text-indigo-600 transition-colors">
                    International
                  </span>
                </label>
              </div>
            </div>

            {/* Destination Dropdown */}
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">
                Select Destination
              </label>
              <CustomDropdown
                value={selectedDestination}
                onChange={(val) => setSelectedDestination(val)}
                placeholder="Choose a destination..."
                options={destinations.map((dest) => ({ value: dest.destination, label: dest.destination }))}
              />
            </div>

            {/* Number of Days */}
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">
                Number of Days
              </label>
              <CustomDropdown
                value={numberOfDays}
                onChange={(val) => setNumberOfDays(val)}
                placeholder="Select number of days..."
                options={days.map((day) => ({ value: day, label: `${day} ${day === 1 ? "Day" : "Days"}` }))}
              />
            </div>

            {/* PDF Upload */}
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">
                Upload Itinerary PDF
              </label>

              {!uploadedFile ? (
                <div className="border-2 border-dashed border-slate-300 hover:border-indigo-500 hover:bg-indigo-50/50 transition-all p-8 rounded-2xl text-center group">
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
                    <div className="bg-indigo-100 p-4 rounded-full mb-4 group-hover:scale-110 transition-transform duration-300">
                      <Upload className="w-8 h-8 text-indigo-600" />
                    </div>
                    <p className="font-bold text-indigo-900">
                      Click to upload PDF
                    </p>
                    <p className="text-xs text-slate-500 mt-1 font-medium">Only .pdf files are supported</p>
                  </label>
                </div>
              ) : (
                <div className="border border-slate-200 rounded-xl p-4 bg-emerald-50 shadow-sm">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="bg-emerald-100 p-2.5 rounded-lg">
                        <FileText className="w-6 h-6 text-emerald-600" />
                      </div>
                      <div>
                        <p className="font-bold text-emerald-900">{uploadedFile.name}</p>
                        <p className="text-xs font-semibold text-emerald-600 mt-0.5">
                          {(uploadedFile.size / 1024).toFixed(2)} KB
                        </p>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={handleRemoveFile}
                      className="p-2 hover:bg-red-100 bg-white border border-red-100 rounded-lg group transition-colors shadow-sm"
                    >
                      <X className="w-5 h-5 text-red-500 group-hover:text-red-700" />
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className={`w-full font-bold text-lg py-3.5 rounded-xl shadow-sm transition-all active:scale-95 
                ${loading
                  ? 'bg-slate-300 text-slate-500 cursor-not-allowed'
                  : 'bg-gradient-to-r from-indigo-600 to-blue-500 text-white hover:shadow-md hover:-translate-y-0.5'
                }
              `}
            >
              {loading ? "Uploading Itinerary..." : "Save Itinerary"}
            </button>
          </form>
        </div>
      </div>
  );
}

export default AddItinerary;
