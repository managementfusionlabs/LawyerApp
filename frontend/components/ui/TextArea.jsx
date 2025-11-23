export default function TextArea({ className = "", ...props }) {
  return (
    <textarea
      className={`w-full p-2 border rounded-lg min-h-[120px] focus:outline-none focus:ring-1 focus:ring-black ${className}`}
      {...props}
    />
  );
}
