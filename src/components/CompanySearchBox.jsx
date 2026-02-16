import React, { useState, useEffect, useRef } from "react";

const CompanySearchBox = ({ value = "", onChange, name = "companyName", placeholder = "Search and select company", required = false, error = "" }) => {
  const [inputValue, setInputValue] = useState(value);
  const [companies, setCompanies] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const inputRef = useRef(null);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const fetchCompanies = async () => {
      setIsLoading(true);
      try {
        const res = await fetch("http://localhost:4000/b2bcompany");
        const data = await res.json();
        if (Array.isArray(data)) {
          const list = data.map((c) => ({
            id: c._id,
            name: c.companyName,
            email: c.email || c.companyEmail || "",
            phone: c.contactPersonNumber || c.companyPhone || c.phone || "",
            whatsapp: c.whatsapp || c.companyWhatsApp || c.whatsAppNo || "",
          }));
          setCompanies(list);
        }
      } catch (err) {
        console.error("Error fetching companies:", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchCompanies();
  }, []);

  useEffect(() => setInputValue(value), [value]);

  useEffect(() => {
    const term = inputValue.toLowerCase().trim();
    if (term === "") {
      setFiltered([]);
      setActiveIndex(-1);
    } else {
      setFiltered(companies.filter((c) => c.name?.toLowerCase().includes(term)));
      setActiveIndex(-1);
    }
  }, [inputValue, companies]);

  const handleInputChange = (e) => {
    const val = e.target.value;
    setInputValue(val);
    setIsOpen(true);
  };

  const handleSelect = (company) => {
    setInputValue(company.name);
    onChange({
      target: {
        name,
        value: company.name,
        id: company.id,
        companyEmail: company.email,
        companyPhone: company.phone,
        companyWhatsApp: company.whatsapp,
      },
    });
    setIsOpen(false);
    setActiveIndex(-1);
  };

  const handleKeyDown = (e) => {
    if (!isOpen) return;
    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setActiveIndex((p) => (p < filtered.length - 1 ? p + 1 : p));
        break;
      case "ArrowUp":
        e.preventDefault();
        setActiveIndex((p) => (p > 0 ? p - 1 : -1));
        break;
      case "Enter":
        e.preventDefault();
        if (activeIndex >= 0 && filtered[activeIndex]) handleSelect(filtered[activeIndex]);
        break;
      case "Escape":
        e.preventDefault();
        setIsOpen(false);
        break;
      default:
        break;
    }
  };

  useEffect(() => {
    const onClickOutside = (e) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target) &&
        inputRef.current &&
        !inputRef.current.contains(e.target)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, []);

  useEffect(() => {
    if (activeIndex >= 0 && dropdownRef.current) {
      const el = dropdownRef.current.children[activeIndex];
      if (el) el.scrollIntoView({ block: "nearest" });
    }
  }, [activeIndex]);

  return (
    <div className="h-auto">
      <label className="block text-xs font-medium text-gray-700 mb-0.5">
        {name.charAt(0).toUpperCase() + name.slice(1)} {required && <span className="text-red-500">*</span>}
      </label>
      <div className="relative">
        <input
          ref={inputRef}
          type="text"
          name={name}
          value={inputValue}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onFocus={() => setIsOpen(true)}
          placeholder={placeholder}
          autoComplete="off"
          className={`w-full px-3 py-1.5 border rounded-lg text-sm outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 ${
            error ? "border-red-300 bg-red-50" : "border-gray-300 hover:border-gray-400"
          }`}
        />
        {isLoading && <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400">Loading...</span>}

        {isOpen && filtered && filtered.length > 0 && (
          <div ref={dropdownRef} className="absolute z-10 w-full bg-white border border-gray-300 rounded-lg shadow-lg mt-1 max-h-60 overflow-y-auto">
            {filtered.map((c, i) => (
              <div key={c.id} onClick={() => handleSelect(c)} className={`px-3 py-2 cursor-pointer text-sm ${i === activeIndex ? "bg-blue-500 text-white" : "bg-white text-gray-700 hover:bg-blue-50"}`}>
                {c.name}
              </div>
            ))}
          </div>
        )}

        {isOpen && inputValue && filtered.length === 0 && (
          <div className="absolute z-10 w-full bg-white border border-gray-300 rounded-lg shadow-lg mt-1 px-3 py-2 text-sm text-gray-500">No companies found</div>
        )}

        {isOpen && !inputValue && companies.length > 0 && (
          <div ref={dropdownRef} className="absolute z-10 w-full bg-white border border-gray-300 rounded-lg shadow-lg mt-1 max-h-60 overflow-y-auto">
            {companies.map((c, i) => (
              <div key={c.id} onClick={() => handleSelect(c)} className={`px-3 py-2 cursor-pointer text-sm ${i === activeIndex ? "bg-blue-500 text-white" : "bg-white text-gray-700 hover:bg-blue-50"}`}>
                {c.name}
              </div>
            ))}
          </div>
        )}
      </div>
      {error && <p className="text-xs text-red-600 mt-1">{error}</p>}
    </div>
  );
};

export default CompanySearchBox;
