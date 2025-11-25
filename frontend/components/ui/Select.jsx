export default function Select({ label, name, value, onChange, options = [], required }) {
  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-[#0B1C39] mb-2">
          {label}
        </label>
      )}

      <select
        name={name}
        value={value}
        onChange={onChange}
        required={required}
        className="w-full border border-gray-200 rounded-xl p-3 bg-white text-base text-[#0B1C39] focus:outline-none focus:ring-2 focus:ring-[#D4A017] focus:border-[#0B1C39] transition-shadow duration-150"
      >
        {options.map((opt, i) => (
          <option key={i} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );
}
