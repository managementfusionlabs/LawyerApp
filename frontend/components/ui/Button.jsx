export default function Button({ children, className = "", variant = "primary", ...props }) {
  // base gives a consistent rounded shape + subtle transform hover
  const base = "px-4 py-2 rounded-xl font-medium transition-all transform-gpu duration-200 ease-out shadow-sm hover:scale-105 hover:shadow-lg hover:rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#D4A017]";
  const variants = {
    primary: "bg-[#0B1C39] text-white border-2 border-[#D4A017] hover:bg-[#D4A017] hover:text-[#0B1C39] hover:shadow-lg",
    ghost: "bg-white text-[#0B1C39] border border-[#D4A017] hover:shadow-sm hover:bg-white/50 hover:rounded-2xl",
  };

  return (
    <button className={`${base} ${variants[variant] || variants.primary} ${className}`} {...props}>
      {children}
    </button>
  );
}
