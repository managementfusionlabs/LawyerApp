export default function Card({ children, className = "" }) {
  return (
    <div className={`p-4 bg-white shadow-lg rounded-xl ring-1 ring-gray-100 ${className}`}>
      {children}
    </div>
  );
}
