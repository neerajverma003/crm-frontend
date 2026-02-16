// // SearchUser.jsx
// import React, { useState, useCallback, useRef } from "react";
// import PropTypes from "prop-types";

// const SearchUser = ({ onSearch, placeholder }) => {
//   const [text, setText] = useState("");
//   const [isFocused, setIsFocused] = useState(false);
//   const inputRef = useRef(null);
//   const debounceRef = useRef(null);

//   const handleChange = useCallback(
//     (e) => {
//       const value = e.target.value;
//       setText(value);

//       if (onSearch) {
//         clearTimeout(debounceRef.current);
//         debounceRef.current = setTimeout(() => {
//           onSearch(value);
//         }, 300);
//       }
//     },
//     [onSearch]
//   );

//   const handleClear = useCallback(() => {
//     setText("");
//     onSearch?.("");
//     inputRef.current?.focus();
//   }, [onSearch]);

//   const handleKeyDown = useCallback(
//     (e) => {
//       if (e.key === "Escape") {
//         handleClear();
//       }
//     },
//     [handleClear]
//   );

//   return (
//     <div
//       className={`relative bg-gray-50 rounded-md transition-all duration-200 ${
//         isFocused ? "ring-2 ring-blue-500 bg-white" : "hover:bg-gray-100"
//       }`}
//     >
//       <div className="flex items-center px-3 py-2 gap-2">
//         {/* Search Icon */}
//         <svg
//           xmlns="http://www.w3.org/2000/svg"
//           width="18"
//           height="18"
//           viewBox="0 0 24 24"
//           fill="none"
//           stroke="currentColor"
//           strokeWidth="2"
//           strokeLinecap="round"
//           strokeLinejoin="round"
//           className={`transition-colors ${
//             isFocused ? "text-blue-500" : "text-gray-500"
//           }`}
//           aria-hidden="true"
//         >
//           <path d="m21 21-4.34-4.34" />
//           <circle cx="11" cy="11" r="8" />
//         </svg>

//         {/* Input */}
//         <input
//           ref={inputRef}
//           className="flex-1 bg-transparent outline-none text-gray-900 placeholder-gray-500 min-w-0"
//           placeholder={placeholder}
//           type="text"
//           value={text}
//           onChange={handleChange}
//           onFocus={() => setIsFocused(true)}
//           onBlur={() => setIsFocused(false)}
//           onKeyDown={handleKeyDown}
//           aria-label={placeholder}
//         />

//         {/* Clear Button */}
//         {text && (
//           <button
//             onClick={handleClear}
//             className="text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-gray-200 transition-colors"
//             aria-label="Clear search"
//             type="button"
//           >
//             <svg
//               xmlns="http://www.w3.org/2000/svg"
//               width="14"
//               height="14"
//               viewBox="0 0 24 24"
//               fill="none"
//               stroke="currentColor"
//               strokeWidth="2"
//               strokeLinecap="round"
//               strokeLinejoin="round"
//             >
//               <path d="M18 6L6 18" />
//               <path d="M6 6l12 12" />
//             </svg>
//           </button>
//         )}
//       </div>
//     </div>
//   );
// };

// // ✅ Add PropTypes for validation
// SearchUser.propTypes = {
//   onSearch: PropTypes.func,
//   placeholder: PropTypes.string,
// };

// SearchUser.defaultProps = {
//   placeholder: "Search users...",
// };

// export { SearchUser };



// SearchUser.jsx
// import React, { useState, useCallback, useRef } from "react";
// import PropTypes from "prop-types";

// const SearchUser = ({ onSearch, placeholder }) => {
//   const [text, setText] = useState("");
//   const [isFocused, setIsFocused] = useState(false);
//   const inputRef = useRef(null);
//   const debounceRef = useRef(null);

//   const handleChange = useCallback(
//     (e) => {
//       const value = e.target.value;
//       setText(value);

//       if (onSearch) {
//         clearTimeout(debounceRef.current);
//         debounceRef.current = setTimeout(() => {
//           onSearch(value);
//         }, 300);
//       }
//     },
//     [onSearch]
//   );

//   const handleClear = useCallback(() => {
//     setText("");
//     onSearch?.("");
//     inputRef.current?.focus();
//   }, [onSearch]);

//   const handleKeyDown = useCallback(
//     (e) => {
//       if (e.key === "Escape") {
//         handleClear();
//       }
//     },
//     [handleClear]
//   );

//   return (
//       <div
//           className={`group relative flex h-14 w-full items-center rounded-full bg-white px-3 shadow-sm ring-1 ring-inset ring-gray-200 transition-all duration-200 focus-within:shadow-md focus-within:ring-2 focus-within:ring-indigo-500 hover:shadow-md sm:w-[68rem] sm:px-4 ${
//               isFocused ? "bg-white ring-2 ring-blue-500" : "hover:bg-gray-100"
//           }`}
//       >
//           <div className="flex items-center gap-2 px-3 py-2">
//               {/* Search Icon */}
//               <svg
//                   xmlns="http://www.w3.org/2000/svg"
//                   width="18"
//                   height="18"
//                   viewBox="0 0 24 24"
//                   fill="none"
//                   stroke="currentColor"
//                   strokeWidth="2"
//                   strokeLinecap="round"
//                   strokeLinejoin="round"
//                   className={`transition-colors ${isFocused ? "text-blue-500" : "text-gray-500"}`}
//                   aria-hidden="true"
//               >
//                   <path d="m21 21-4.34-4.34" />
//                   <circle
//                       cx="11"
//                       cy="11"
//                       r="8"
//                   />
//               </svg>

//               {/* Input */}
//               <input
//                   ref={inputRef}
//                   className="min-w-0 flex-1 bg-transparent text-gray-900 placeholder-gray-500 outline-none"
//                   placeholder={placeholder}
//                   type="text"
//                   value={text}
//                   onChange={handleChange}
//                   onFocus={() => setIsFocused(true)}
//                   onBlur={() => setIsFocused(false)}
//                   onKeyDown={handleKeyDown}
//                   aria-label={placeholder}
//               />

//               {/* Clear Button */}
//               {text && (
//                   <button
//                       onClick={handleClear}
//                       className="rounded-full p-1 text-gray-400 transition-colors hover:bg-gray-200 hover:text-gray-600"
//                       aria-label="Clear search"
//                       type="button"
//                   >
//                       <svg
//                           xmlns="http://www.w3.org/2000/svg"
//                           width="14"
//                           height="14"
//                           viewBox="0 0 24 24"
//                           fill="none"
//                           stroke="currentColor"
//                           strokeWidth="2"
//                           strokeLinecap="round"
//                           strokeLinejoin="round"
//                       >
//                           <path d="M18 6L6 18" />
//                           <path d="M6 6l12 12" />
//                       </svg>
//                   </button>
//               )}
//           </div>
//       </div>
//   );
// };

// // ✅ Add PropTypes for validation
// SearchUser.propTypes = {
//   onSearch: PropTypes.func,
//   placeholder: PropTypes.string,
// };

// SearchUser.defaultProps = {
//   placeholder: "Search users...",
// };

// export { SearchUser };


import React, { useState, useCallback, useRef } from "react";
import PropTypes from "prop-types";

const SearchUser = ({ onSearch, placeholder }) => {
    const [text, setText] = useState("");
    const [isFocused, setIsFocused] = useState(false);
    const inputRef = useRef(null);
    const debounceRef = useRef(null);

    const handleChange = useCallback(
        (e) => {
            const value = e.target.value;
            setText(value);

            if (onSearch) {
                clearTimeout(debounceRef.current);
                debounceRef.current = setTimeout(() => {
                    onSearch(value);
                }, 300);
            }
        },
        [onSearch],
    );

    const handleClear = useCallback(() => {
        setText("");
        onSearch?.("");
        inputRef.current?.focus();
    }, [onSearch]);

    const handleKeyDown = useCallback(
        (e) => {
            if (e.key === "Escape") {
                handleClear();
            }
        },
        [handleClear],
    );

    return (
        <div
            className={`group relative flex h-12 w-full items-center rounded-full bg-white px-2 shadow-sm ring-1 ring-inset ring-gray-200 transition-all duration-200 focus-within:shadow-md focus-within:ring-2 focus-within:ring-indigo-500 hover:shadow-md sm:h-14 sm:px-3 md:px-4 ${isFocused ? "bg-white ring-2 ring-blue-500" : "hover:bg-gray-100"} `}
        >
            <div className="flex w-full items-center gap-1.5 px-1 py-2 sm:gap-2 sm:px-3">
                {/* Search Icon */}
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    sm:width="18"
                    height="16"
                    sm:height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className={`flex-shrink-0 transition-colors ${isFocused ? "text-blue-500" : "text-gray-500"}`}
                    aria-hidden="true"
                >
                    <path d="m21 21-4.34-4.34" />
                    <circle
                        cx="11"
                        cy="11"
                        r="8"
                    />
                </svg>

                {/* Input */}
                <input
                    ref={inputRef}
                    className="min-w-0 flex-1 bg-transparent px-1 text-sm text-gray-900 placeholder-gray-500 outline-none sm:text-base"
                    placeholder={placeholder}
                    type="text"
                    value={text}
                    onChange={handleChange}
                    onFocus={() => setIsFocused(true)}
                    onBlur={() => setIsFocused(false)}
                    onKeyDown={handleKeyDown}
                    aria-label={placeholder}
                />

                {/* Clear Button */}
                {text && (
                    <button
                        onClick={handleClear}
                        className="ml-1 flex-shrink-0 rounded-full p-1 text-gray-400 transition-colors hover:bg-gray-200 hover:text-gray-600"
                        aria-label="Clear search"
                        type="button"
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="12"
                            sm:width="14"
                            height="12"
                            sm:height="14"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        >
                            <path d="M18 6L6 18" />
                            <path d="M6 6l12 12" />
                        </svg>
                    </button>
                )}
            </div>
        </div>
    );
};

// ✅ Add PropTypes for validation
SearchUser.propTypes = {
    onSearch: PropTypes.func,
    placeholder: PropTypes.string,
};

SearchUser.defaultProps = {
    placeholder: "Search users...",
};

export { SearchUser };