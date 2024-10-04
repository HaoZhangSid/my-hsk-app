"use client";

import { useState } from 'react';

const hskLevels = [
  { value: "1", label: "HSK 1" },
  { value: "2", label: "HSK 2" },
  { value: "3", label: "HSK 3" },
  { value: "4", label: "HSK 4" },
  { value: "5", label: "HSK 5" },
  { value: "6", label: "HSK 6" },
];

export default function HSKSelector({ onChange }) {
  const [value, setValue] = useState("");

  const handleSelect = (e) => {
    const selectedValue = e.target.value;
    setValue(selectedValue);
    onChange(selectedValue);
  };

  return (
    <div className="w-full max-w-sm space-y-4">
      <label htmlFor="hsk-level" className="block text-lg font-medium text-gray-700">
        选择 HSK 等级:
      </label>
      <select
        id="hsk-level"
        value={value}
        onChange={handleSelect}
        className="w-full p-2 border border-gray-300 rounded-md"
      >
        <option value="">选择 HSK 等级</option>
        {hskLevels.map((level) => (
          <option key={level.value} value={level.value}>
            {level.label}
          </option>
        ))}
      </select>
    </div>
  );
}
