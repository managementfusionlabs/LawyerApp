"use client";
export default function Checkbox({ label, checked, onChange, name }) {
  return (
    <label className="inline-flex items-center gap-2 text-sm cursor-pointer">
      <input
        name={name}
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="w-5 h-5 rounded border border-gray-200 bg-white checked:bg-[#0B1C39] checked:border-[#0B1C39] text-white focus:outline-none focus:ring-2 focus:ring-[#D4A017] transition-colors duration-150"
      />
      <span className="text-[#0B1C39]">{label}</span>
    </label>
  );
}
