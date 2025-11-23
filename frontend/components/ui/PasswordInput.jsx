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
      />
      <button
        type="button"
        onClick={() => setVisible((s) => !s)}
        className="absolute right-2 top-3 text-sm text-gray-600"
        aria-label={visible ? "Hide password" : "Show password"}
      >
        {visible ? "🙈" : "👁️"}
      </button>
    </div>
  );
}
