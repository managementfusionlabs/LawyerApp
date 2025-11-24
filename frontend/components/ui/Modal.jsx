"use client";

export default function Modal({ show, children }) {
  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-[#0B1C39]/40 flex items-center justify-center p-4 z-50">
      <div className="bg-white p-6 rounded-xl shadow max-w-lg w-full border-l-4 border-[#D4A017]">
        {children}
      </div>
    </div>
  );
}
