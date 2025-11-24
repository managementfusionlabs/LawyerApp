export default function TextArea({ className = "", ...props }) {
  return (
    <textarea
      className={`w-full p-2 border rounded-lg min-h-[120px] focus:outline-none focus:ring-2 focus:ring-[#D4A017] focus:border-[#0B1C39] ${className}`}
      {...props}
    />
  );
}
