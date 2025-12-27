import React, { useEffect, useState } from "react";

const SearchFilter = ({
  searchValue,
  onSearchChange,
  selectValue,
  onSelectChange,
  selectOptions = [],
  searchPlaceholder = "Search...",
  debounceDelay = 400,
  showSelect = true,
  showClear = true,
}) => {
  const [localSearch, setLocalSearch] = useState(searchValue);

  // 🔁 Sync external value
  useEffect(() => {
    setLocalSearch(searchValue);
  }, [searchValue]);

  // ⏳ Debounce logic
  useEffect(() => {
    const timer = setTimeout(() => {
      onSearchChange(localSearch);
    }, debounceDelay);

    return () => clearTimeout(timer);
  }, [localSearch, debounceDelay, onSearchChange]);

  // ❌ Clear handler
  const handleClear = () => {
    setLocalSearch("");
    onSearchChange("");
    onSelectChange?.("");
  };

  return (
    <div className="flex flex-col sm:flex-row gap-4 w-full items-center">
      {/* 🔍 Search Input */}
      <div className="relative w-full sm:w-64">
        <input
          type="text"
          value={localSearch}
          onChange={(e) => setLocalSearch(e.target.value)}
          placeholder={searchPlaceholder}
          className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        {showClear && localSearch && (
          <button
            onClick={handleClear}
            className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600"
          >
            ✕
          </button>
        )}
      </div>

      {/* ⬇️ Select */}
      {showSelect && (
        <select
          value={selectValue}
          onChange={(e) => onSelectChange(e.target.value)}
          className="w-full sm:w-48 px-4 py-2 border rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">All</option>
          {selectOptions.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      )}
    </div>
  );
};

export default SearchFilter;
