import React, { useState } from "react";
import { Plus, Save, Upload, X, User, Phone, MessageSquare, Mic } from "lucide-react";

const AddReport = () => {
  const [persons, setPersons] = useState([
    { name: "", phone: "", comments: "", recording: null },
  ]);

  const handleInputChange = (index, field, value) => {
    const updatedPersons = [...persons];
    updatedPersons[index][field] = value;
    setPersons(updatedPersons);
  };

  const handleFileChange = (index, file) => {
    const updatedPersons = [...persons];
    updatedPersons[index].recording = file;
    setPersons(updatedPersons);
  };

  const removeForm = (index) => {
    if (persons.length > 1) {
      const updatedPersons = persons.filter((_, i) => i !== index);
      setPersons(updatedPersons);
    }
  };

  const addForm = () => {
    if (persons.length < 100) {
      setPersons([
        ...persons,
        { name: "", phone: "", comments: "", recording: null },
      ]);
    } else {
      alert("Maximum 100 persons allowed");
    }
  };

  const saveForm = (index) => {
    const person = persons[index];
    console.log("Saving person", index + 1, person);
    alert(`Person ${index + 1} saved!`);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white px-6 py-5">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-2xl font-bold">Sales Report</h1>
          <p className="text-gray-400 text-sm mt-1">
            Track customer interactions and manage sales data
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-6">
        {/* Stats & Action Bar */}
        <div className="mb-6 bg-white px-5 py-4 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-3">
                <div className="bg-black text-white w-12 h-12 rounded-xl flex items-center justify-center font-bold text-xl">
                  {persons.length}
                </div>
                <div>
                  <p className="text-xs text-gray-500 uppercase">Total Entries</p>
                  <p className="text-sm font-semibold text-black">Persons Added</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="bg-white border-2 border-black text-black w-12 h-12 rounded-xl flex items-center justify-center font-bold text-xl">
                  {100 - persons.length}
                </div>
                <div>
                  <p className="text-xs text-gray-500 uppercase">Remaining</p>
                  <p className="text-sm font-semibold text-black">Slots Available</p>
                </div>
              </div>
            </div>
            <button
              onClick={addForm}
              disabled={persons.length >= 100}
              className="bg-black text-white px-5 py-2.5 rounded-lg hover:bg-gray-800 transition-all flex items-center gap-2 font-semibold text-sm disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              <Plus size={18} />
              Add New Person
            </button>
          </div>
        </div>

        {/* Forms */}
        <div className="space-y-5">
          {persons.map((person, index) => (
            <div
              key={index}
              className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden"
            >
              {/* Card Header */}
              <div className="bg-black text-white px-5 py-3 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="bg-white text-black w-7 h-7 rounded-lg flex items-center justify-center font-bold text-sm">
                    {index + 1}
                  </div>
                  <h3 className="font-bold text-base">Person {index + 1}</h3>
                </div>
                {persons.length > 1 && (
                  <button
                    onClick={() => removeForm(index)}
                    className="text-white hover:text-red-400 transition-colors"
                    title="Remove Person"
                  >
                    <X size={20} />
                  </button>
                )}
              </div>

              {/* Card Body */}
              <div className="p-5">
                {/* Name & Phone in One Row */}
                <div className="grid grid-cols-2 gap-4 mb-4">
                  {/* Name Field */}
                  <div>
                    <label
                      className="flex items-center gap-1.5 mb-2 font-semibold text-black text-xs uppercase"
                      htmlFor={`name-${index}`}
                    >
                      <User size={14} />
                      Name
                    </label>
                    <input
                      id={`name-${index}`}
                      type="text"
                      value={person.name}
                      onChange={(e) =>
                        handleInputChange(index, "name", e.target.value)
                      }
                      placeholder="Enter full name"
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm text-black placeholder-gray-400 focus:border-black focus:outline-none transition-all"
                    />
                  </div>

                  {/* Phone Field */}
                  <div>
                    <label
                      className="flex items-center gap-1.5 mb-2 font-semibold text-black text-xs uppercase"
                      htmlFor={`phone-${index}`}
                    >
                      <Phone size={14} />
                      Phone Number
                    </label>
                    <input
                      id={`phone-${index}`}
                      type="tel"
                      value={person.phone}
                      onChange={(e) =>
                        handleInputChange(index, "phone", e.target.value)
                      }
                      placeholder="Enter phone number"
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm text-black placeholder-gray-400 focus:border-black focus:outline-none transition-all"
                      pattern="[0-9]{10,15}"
                      maxLength={15}
                    />
                  </div>
                </div>

                {/* Comments Field */}
                <div className="mb-4">
                  <label
                    className="flex items-center gap-1.5 mb-2 font-semibold text-black text-xs uppercase"
                    htmlFor={`comments-${index}`}
                  >
                    <MessageSquare size={14} />
                    Comments
                  </label>
                  <textarea
                    id={`comments-${index}`}
                    value={person.comments}
                    onChange={(e) =>
                      handleInputChange(index, "comments", e.target.value)
                    }
                    placeholder="Add notes, observations, or important details..."
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm text-black placeholder-gray-400 focus:border-black focus:outline-none transition-all resize-none"
                    rows={3}
                  />
                </div>

                {/* Recording Upload */}
                <div className="mb-4">
                  <label className="flex items-center gap-1.5 mb-2 font-semibold text-black text-xs uppercase">
                    <Mic size={14} />
                    Recording Upload
                  </label>
                  <div className="relative">
                    <input
                      id={`recording-${index}`}
                      type="file"
                      accept="audio/*"
                      onChange={(e) =>
                        handleFileChange(
                          index,
                          e.target.files ? e.target.files[0] : null
                        )
                      }
                      className="hidden"
                    />
                    <label
                      htmlFor={`recording-${index}`}
                      className="flex items-center gap-2 w-full border border-dashed border-gray-400 rounded-lg px-4 py-2.5 cursor-pointer hover:border-black hover:bg-gray-50 transition-all"
                    >
                      <Upload size={16} className="text-gray-600" />
                      <span className="text-sm text-gray-600">
                        {person.recording ? person.recording.name : "Choose audio file or drag and drop"}
                      </span>
                    </label>
                  </div>
                  {person.recording && (
                    <div className="mt-2 p-2 bg-black text-white rounded-lg flex items-center gap-2 text-xs">
                      <Mic size={14} />
                      <span className="truncate">{person.recording.name}</span>
                      <span className="text-gray-400 ml-auto">
                        {(person.recording.size / 1024).toFixed(1)} KB
                      </span>
                    </div>
                  )}
                </div>

                {/* Save Button */}
                <button
                  onClick={() => saveForm(index)}
                  className="w-full bg-black text-white px-4 py-2.5 rounded-lg hover:bg-gray-800 transition-all flex items-center justify-center gap-2 font-semibold text-sm"
                >
                  <Save size={16} />
                  Save Person {index + 1}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AddReport;