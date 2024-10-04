"use client";

import { useState } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

const hskLevels = [
  { value: "1", label: "HSK 1" },
  { value: "2", label: "HSK 2" },
  { value: "3", label: "HSK 3" },
  { value: "4", label: "HSK 4" },
  { value: "5", label: "HSK 5" },
  { value: "6", label: "HSK 6" },
];

export default function HSKSelector({ onChange }) {
  const [value, setValue] = useState("1");

  const handleSelect = (selectedValue) => {
    setValue(selectedValue);
    onChange(selectedValue);
  };

  return (
    <div className="w-full max-w-sm space-y-4">
      <label htmlFor="hsk-level" className="block text-lg font-medium text-pink-700">
        选择 HSK 等级:
      </label>
      <Select onValueChange={handleSelect} value={value}>
        <SelectTrigger id="hsk-level" className="w-full p-2 border border-pink-300 rounded-md bg-white text-pink-800 focus:ring-pink-500 focus:border-pink-500">
          <SelectValue placeholder="选择 HSK 等级" />
        </SelectTrigger>
        <SelectContent className="bg-white border border-pink-300 rounded-md shadow-lg">
          {hskLevels.map((level) => (
            <SelectItem 
              key={level.value} 
              value={level.value}
              className="text-pink-800 hover:bg-pink-100 focus:bg-pink-200"
            >
              {level.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}