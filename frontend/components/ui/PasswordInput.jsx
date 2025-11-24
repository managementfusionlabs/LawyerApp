"use client";
import { useState } from "react";
import FloatingInput from "./FloatingInput";

export default function PasswordInput({ name = "password", value, onChange, label = "Password", className = "" }) {
  const [visible, setVisible] = useState(false);
  return (
    <div className={`relative ${className}`}>
      <FloatingInput
        name={name}
        label={label}
        type={visible ? "text" : "password"}
        value={value}
        onChange={onChange}
        className="w-full"
      />
      <button
        type="button"
        onClick={() => setVisible((s) => !s)}
        className="absolute right-3 top-3 text-sm text-gray-600 transition-all duration-200 transform-gpu hover:scale-105 rounded-full p-2 hover:bg-[#D4A017] hover:text-[#0B1C39] hover:shadow-md focus:outline-none"
        aria-label={visible ? "Hide password" : "Show password"}
      >
        {visible ? "🙈" : "👁️"}
      </button>
    </div>
  );
}
