"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

const links = [
  { name: "Dashboard", href: "/dashboard" },
  { name: "Cases", href: "/dashboard/cases" },
  { name: "Drafts", href: "/dashboard/drafts" },
  { name: "Settings", href: "/dashboard/settings" },
];

export default function Sidebar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  // showLogo determines whether an externally provided logo exists at /logo.png
  const [showLogo, setShowLogo] = useState(true);

  return (
    <>
      {/* Mobile top bar */}
        <div className="md:hidden flex items-center justify-between bg-[#0B1C39] text-white p-3 shadow">
        <div className="flex items-center gap-3">
          <span className="w-8 h-8 rounded-full bg-[#D4A017] flex items-center justify-center text-[#0B1C39]">
            <svg xmlns="http://www.w3.org/2000/svg" aria-hidden="true" className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M12 2l3 6h-6l3-6z" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M6 9v2a6 6 0 0012 0V9" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M4 21h16" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M8 13l-2 4" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M16 13l2 4" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </span>
          <span className="text-lg font-bold font-serif text-[#D4A017]">Lawyer Panel</span>
        </div>
        <button onClick={() => setOpen(!open)} aria-label="Open menu" className="p-2 rounded border border-white/10 transition-all duration-200 transform-gpu hover:scale-105 hover:rounded-2xl hover:bg-[#D4A017] hover:text-[#0B1C39] focus:outline-none">
          ☰
        </button>
      </div>

      {/* Mobile drawer */}
      {open && (
        <div className="md:hidden bg-[#0B1C39] text-white shadow p-4">
          <nav className="space-y-2">
            {links.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className={`block p-2 rounded ${pathname === item.href ? "bg-white/5 text-white font-semibold rounded-2xl" : "text-white/80"} transition-all duration-200 transform-gpu hover:scale-105 hover:rounded-2xl hover:bg-[#D4A017] hover:text-[#0B1C39]`}
              >
                {item.name}
              </Link>
            ))}
          </nav>
        </div>
      )}

      {/* Desktop sidebar */}
      <aside className="hidden md:block w-64 bg-[#0B1C39] text-white shadow-md p-6 min-h-screen">
        <h2 className="flex items-center gap-3 font-bold text-2xl mb-8 tracking-wide font-serif text-[#D4A017]">
          <span className="w-10 h-10 rounded-full bg-[#D4A017] flex items-center justify-center text-[#0B1C39]">
            <svg xmlns="http://www.w3.org/2000/svg" aria-hidden="true" className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M12 2l4 8h-8l4-8z" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M5 10v3a7 7 0 0014 0v-3" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M4 21h16" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M8 14l-2 5" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M16 14l2 5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </span>
          Lawyer Panel
        </h2>
        <nav className="space-y-3">
          {links.map((item) => {
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`block p-3 rounded-lg text-sm font-medium ${active ? "bg-white/5 text-white font-semibold rounded-2xl" : "text-white/80"} transition-all duration-200 transform-gpu hover:scale-105 hover:rounded-2xl hover:bg-[#D4A017] hover:text-[#0B1C39]`}
              >
                {item.name}
              </Link>
            );
          })}
        </nav>
      </aside>
    </>
  );
}
