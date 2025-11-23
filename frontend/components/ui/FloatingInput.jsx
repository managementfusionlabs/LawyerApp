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
        className="peer placeholder-transparent w-full border rounded-md px-3 py-3 bg-white focus:outline-none focus:ring-2 focus:ring-black"
        {...props}
      />
      <label
        htmlFor={id || name}
        className={`absolute left-3 transition-all pointer-events-none ${
          value || focused ? "-top-3 text-xs bg-white px-1 text-gray-600" : "top-3 text-sm text-gray-400"
        }`}
      >
        {label}
      </label>
    </div>
  );
}
