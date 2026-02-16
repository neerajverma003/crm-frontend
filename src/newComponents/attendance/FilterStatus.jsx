import { useState, useEffect, useRef } from "react";

const roles = ["All Roles", "Admin", "Manager", "Sales Rep", "User"];

const FilterStatus = () => {
  const [role, setRole] = useState("All Roles");
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef(null);

  const handleSelect = (selectedRole) => {
    setRole(selectedRole);
    setOpen(false);
    console.log("Selected Role:", selectedRole);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="relative w-64" ref={dropdownRef}>
      {/* Parent */}
      <div
        className="flex items-center justify-between bg-[#f3f3f5] rounded-md px-2 py-2 cursor-pointer"
        onClick={() => setOpen(!open)}
      >
        <div className="flex items-center gap-2 text-black">
          {/* Funnel Icon */}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="lucide lucide-funnel text-gray-500"
          >
            <path d="M10 20a1 1 0 0 0 .553.895l2 1A1 1 0 0 0 14 21v-7a2 2 0 0 1 .517-1.341L21.74 4.67A1 1 0 0 0 21 3H3a1 1 0 0 0-.742 1.67l7.225 7.989A2 2 0 0 1 10 14z" />
          </svg>
          <span>{role}</span>
        </div>

        {/* Chevron Icon */}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={`lucide lucide-chevron-down text-gray-600 transition-transform ${
            open ? "rotate-180" : ""
          }`}
        >
          <path d="m6 9 6 6 6-6" />
        </svg>
      </div>

      {/* Dropdown */}
      {open && (
        <div className="absolute mt-1 w-full bg-white border border-gray-300 rounded-md shadow-md z-10">
          {roles.map((r) => (
            <div
              key={r}
              onClick={() => handleSelect(r)}
              className="px-2 py-2 cursor-pointer hover:bg-gray-100"
            >
              {r}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default FilterStatus;
