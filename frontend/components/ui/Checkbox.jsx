"use client";
export default function Checkbox({ label, checked, onChange, name }) {
  return (
    <label className="inline-flex items-center gap-2 text-sm cursor-pointer">
      <input
        name={name}
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="w-4 h-4 rounded border border-[#0B1C39] text-[#0B1C39]"
      />
      <span className="text-[#0B1C39]">{label}</span>
    </label>
  );
}
