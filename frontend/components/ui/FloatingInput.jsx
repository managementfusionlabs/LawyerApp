"use client";
import { useState, useEffect } from "react";

export default function FloatingInput({
  id,
  name,
  label,
  type = "text",
  value,
  onChange,
  required = false,
  className = "",
  ...props
}) {
  const [focused, setFocused] = useState(false);
  useEffect(() => {}, []);
  return (
    <div className={`relative ${className}`}>
      <input
        id={id || name}
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        required={required}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        className="peer placeholder-transparent w-full p-3 rounded-xl border border-gray-200 bg-white text-[#0B1C39] focus:ring-2 focus:ring-[#D4A017] focus:border-[#0B1C39] focus:shadow-sm focus:shadow-[rgba(212,160,23,0.12)] outline-none transition-shadow duration-150"
        {...props}
      />
      <label
        htmlFor={id || name}
        className={`absolute left-3 transition-all pointer-events-none ${
          value || focused ? "-top-3 text-xs bg-white px-1 text-[#0B1C39]" : "top-3 text-sm text-gray-400"
        }`}
      >
        {label}
      </label>
    </div>
  );
}
