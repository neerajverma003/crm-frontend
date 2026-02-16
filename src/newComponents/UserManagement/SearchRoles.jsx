// import React, { useState, useEffect, useRef, useCallback } from "react";
// import PropTypes from "prop-types";

// const ROLES = ["All Roles", "Admin","employee"];

// const SearchRole = ({ onRoleChange, defaultRole }) => {
//   const [role, setRole] = useState(defaultRole);
//   const [isOpen, setIsOpen] = useState(false);
//   const dropdownRef = useRef(null);
//   const buttonRef = useRef(null);

//   const handleSelect = useCallback(
//     (selectedRole) => {
//       setRole(selectedRole);
//       setIsOpen(false);
//       onRoleChange?.(selectedRole);
//     },
//     [onRoleChange]
//   );

//   // Close dropdown on outside click
//   useEffect(() => {
//     const handleClickOutside = (event) => {
//       if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
//         setIsOpen(false);
//       }
//     };
//     document.addEventListener("mousedown", handleClickOutside);
//     return () => document.removeEventListener("mousedown", handleClickOutside);
//   }, []);

//   // Handle keyboard navigation for main button
//   const handleKeyDown = useCallback(
//     (e) => {
//       if (["Enter", " "].includes(e.key)) {
//         e.preventDefault();
//         setIsOpen((prev) => !prev);
//       } else if (e.key === "Escape") {
//         setIsOpen(false);
//         buttonRef.current?.focus();
//       } else if (e.key === "ArrowDown" && isOpen) {
//         e.preventDefault();
//         const firstOption = dropdownRef.current?.querySelector('[role="option"]');
//         firstOption?.focus();
//       }
//     },
//     [isOpen]
//   );

//   // Handle keyboard navigation for options
//   const handleOptionKeyDown = useCallback(
//     (e, selectedRole) => {
//       if (["Enter", " "].includes(e.key)) {
//         e.preventDefault();
//         handleSelect(selectedRole);
//       } else if (e.key === "Escape") {
//         setIsOpen(false);
//         buttonRef.current?.focus();
//       } else if (e.key === "ArrowDown") {
//         e.preventDefault();
//         e.target.nextElementSibling?.focus();
//       } else if (e.key === "ArrowUp") {
//         e.preventDefault();
//         const prev = e.target.previousElementSibling;
//         if (prev) {
//           prev.focus();
//         } else {
//           buttonRef.current?.focus();
//           setIsOpen(false);
//         }
//       }
//     },
//     [handleSelect]
//   );

//   return (
//     <div className="relative" ref={dropdownRef}>
//       <button
//         ref={buttonRef}
//         type="button"
//         className={`flex items-center justify-between bg-gray-50 rounded-md px-3 py-2 cursor-pointer min-w-[160px] transition-all duration-200 ${
//           isOpen ? "ring-2 ring-blue-500 bg-white" : "hover:bg-gray-100"
//         }`}
//         onClick={() => setIsOpen((prev) => !prev)}
//         onKeyDown={handleKeyDown}
//         aria-expanded={isOpen}
//         aria-haspopup="listbox"
//         aria-label="Filter by role"
//       >
//         <div className="flex items-center gap-2 text-gray-700">
//           <span className="font-medium">{role}</span>
//         </div>

//         <svg
//           xmlns="http://www.w3.org/2000/svg"
//           width="16"
//           height="16"
//           viewBox="0 0 24 24"
//           fill="none"
//           stroke="currentColor"
//           strokeWidth="2"
//           strokeLinecap="round"
//           strokeLinejoin="round"
//           className={`text-gray-500 transition-transform duration-200 ${
//             isOpen ? "rotate-180" : ""
//           }`}
//           aria-hidden="true"
//         >
//           <path d="m6 9 6 6 6-6" />
//         </svg>
//       </button>

//       {isOpen && (
//         <div
//           className="absolute mt-1 w-full bg-white border border-gray-200 rounded-md shadow-lg z-20 py-1"
//           role="listbox"
//         >
//           {ROLES.map((roleOption) => (
//             <button
//               key={roleOption}
//               type="button"
//               role="option"
//               aria-selected={role === roleOption}
//               onClick={() => handleSelect(roleOption)}
//               onKeyDown={(e) => handleOptionKeyDown(e, roleOption)}
//               className={`w-full text-left px-3 py-2 hover:bg-blue-50 focus:bg-blue-50 focus:outline-none transition-colors ${
//                 role === roleOption
//                   ? "bg-blue-100 text-blue-900 font-medium"
//                   : "text-gray-700"
//               }`}
//               tabIndex={-1}
//             >
//               {roleOption}
//             </button>
//           ))}
//         </div>
//       )}
//     </div>
//   );
// };

// // ✅ Add PropTypes for validation
// SearchRole.propTypes = {
//   onRoleChange: PropTypes.func,
//   defaultRole: PropTypes.oneOf(ROLES),
// };

// SearchRole.defaultProps = {
//   defaultRole: "All Roles",
// };

// export { SearchRole };


import React, { useState, useEffect, useRef, useCallback } from "react";
import PropTypes from "prop-types";

const ROLES = ["All Roles", "Admin","employee"];

const SearchRole = ({ onRoleChange, defaultRole }) => {
  const [role, setRole] = useState(defaultRole);
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const buttonRef = useRef(null);

  const handleSelect = useCallback(
    (selectedRole) => {
      setRole(selectedRole);
      setIsOpen(false);
      onRoleChange?.(selectedRole);
    },
    [onRoleChange]
  );

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Handle keyboard navigation for main button
  const handleKeyDown = useCallback(
    (e) => {
      if (["Enter", " "].includes(e.key)) {
        e.preventDefault();
        setIsOpen((prev) => !prev);
      } else if (e.key === "Escape") {
        setIsOpen(false);
        buttonRef.current?.focus();
      } else if (e.key === "ArrowDown" && isOpen) {
        e.preventDefault();
        const firstOption = dropdownRef.current?.querySelector('[role="option"]');
        firstOption?.focus();
      }
    },
    [isOpen]
  );

  // Handle keyboard navigation for options
  const handleOptionKeyDown = useCallback(
    (e, selectedRole) => {
      if (["Enter", " "].includes(e.key)) {
        e.preventDefault();
        handleSelect(selectedRole);
      } else if (e.key === "Escape") {
        setIsOpen(false);
        buttonRef.current?.focus();
      } else if (e.key === "ArrowDown") {
        e.preventDefault();
        e.target.nextElementSibling?.focus();
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        const prev = e.target.previousElementSibling;
        if (prev) {
          prev.focus();
        } else {
          buttonRef.current?.focus();
          setIsOpen(false);
        }
      }
    },
    [handleSelect]
  );

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        ref={buttonRef}
        type="button"
        className={`group flex h-14  w-[12rem] items-center justify-between rounded-full bg-white px-4 sm:px-4 shadow-sm ring-1 ring-inset ring-gray-200 transition-all duration-200 hover:shadow-md focus-visible:shadow-md focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-0 ${
          isOpen ? "ring-2 ring-blue-500 bg-white" : "hover:bg-gray-100"
        }`}
        onClick={() => setIsOpen((prev) => !prev)}
        onKeyDown={handleKeyDown}
        aria-expanded={isOpen}
        aria-haspopup="listbox"
        aria-label="Filter by role"
      >
        <div className="flex items-center gap-2 text-gray-700">
          <span className="font-medium">{role}</span>
        </div>

        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={`text-gray-500 transition-transform duration-200 ${
            isOpen ? "rotate-180" : ""
          }`}
          aria-hidden="true"
        >
          <path d="m6 9 6 6 6-6" />
        </svg>
      </button>

      {isOpen && (
        <div
          className="absolute mt-1 w-full bg-white border border-gray-200 rounded-md shadow-lg z-20 py-1"
          role="listbox"
        >
          {ROLES.map((roleOption) => (
            <button
              key={roleOption}
              type="button"
              role="option"
              aria-selected={role === roleOption}
              onClick={() => handleSelect(roleOption)}
              onKeyDown={(e) => handleOptionKeyDown(e, roleOption)}
              className={`w-full text-left px-3 py-2 hover:bg-blue-50 focus:bg-blue-50 focus:outline-none transition-colors ${
                role === roleOption
                  ? "bg-blue-100 text-blue-900 font-medium"
                  : "text-gray-700"
              }`}
              tabIndex={-1}
            >
              {roleOption}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

// ✅ Add PropTypes for validation
SearchRole.propTypes = {
  onRoleChange: PropTypes.func,
  defaultRole: PropTypes.oneOf(ROLES),
};

SearchRole.defaultProps = {
  defaultRole: "All Roles",
};

export { SearchRole };