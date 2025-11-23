export default function Select({ label, name, value, onChange, options = [], required }) {
  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {label}
        </label>
      )}

      <select
        name={name}
        value={value}
        onChange={onChange}
        required={required}
        className="
          w-full
          border
          rounded-md
          p-3
          bg-white
          text-gray-800
          focus:outline-none
          focus:ring-2
          focus:ring-black
        "
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
