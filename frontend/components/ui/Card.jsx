export default function Card({ children, className = "" }) {
  return (
    <div className={`p-4 bg-white shadow rounded-xl ${className}`}>
      {children}
    </div>
  );
}
