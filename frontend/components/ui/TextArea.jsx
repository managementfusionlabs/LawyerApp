export default function TextArea({ className = "", ...props }) {
  return (
    <textarea
      className={`w-full p-3 min-h-[140px] border border-gray-200 rounded-xl bg-white text-base text-[#0B1C39] focus:outline-none focus:ring-2 focus:ring-[#D4A017] focus:border-[#0B1C39] transition-shadow duration-150 ${className}`}
      {...props}
    />
  );
}
