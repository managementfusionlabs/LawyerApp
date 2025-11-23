export default function Input({ className = "", ...props }) {
  return (
    <input
      className={`w-full p-2 border rounded-lg focus:outline-none focus:ring-1 focus:ring-black ${className}`}
      {...props}
    />
  );
}
