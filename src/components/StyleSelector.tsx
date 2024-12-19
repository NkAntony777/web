import React from 'react';
import { StyleOption } from '../types';

interface StyleSelectorProps {
  value: StyleOption;
  onChange: (value: StyleOption) => void;
}

export const StyleSelector: React.FC<StyleSelectorProps> = ({ value, onChange }) => {
  return (
    <div>
      <label className="block text-sm font-medium mb-2">Select Style</label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value as StyleOption)}
        className="w-full bg-gray-700 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        <option value="Cuphead">Cuphead</option>
        <option value="Starry Night">Starry Night</option>
        <option value="Mosaic">Mosaic</option>
      </select>
    </div>
  );
};