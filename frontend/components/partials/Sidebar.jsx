"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState, useEffect } from "react";

const links = [
  { name: "Dashboard", href: "/dashboard" },
  { name: "Cases", href: "/dashboard/cases" },
  { name: "Drafts", href: "/dashboard/drafts" },
  { name: "Settings", href: "/dashboard/settings" },
  { name: "Profile", href: "/dashboard/profile" },
];

export default function Sidebar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const router = useRouter();

  // --- DARK MODE LOGIC ---
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    // Check localStorage on mount
    const isDark = localStorage.getItem("theme") === "dark";
    setDarkMode(isDark);
    applyTheme(isDark);
  }, []);

  const applyTheme = (isDark) => {
    if (isDark) {
      // Dark Mode: Dark Gray background, lighter text
      document.body.classList.remove("bg-gray-100", "text-gray-900");
      document.body.classList.add("bg-[#1f2937]", "text-gray-100"); // #1f2937 is gray-800
    } else {
      // Light Mode: Default gray-100 background, dark text
      document.body.classList.remove("bg-[#1f2937]", "text-gray-100");
      document.body.classList.add("bg-gray-100", "text-gray-900");
    }
  };

  const toggleTheme = () => {
    const newMode = !darkMode;
    setDarkMode(newMode);
    localStorage.setItem("theme", newMode ? "dark" : "light");
    applyTheme(newMode);
  };

  // --- PREMIUM TOGGLE COMPONENT ---
  const ThemeToggle = () => (
    <button
      onClick={toggleTheme}
      className={`
        relative w-full flex items-center justify-between p-2 rounded-xl transition-all duration-300 border
        ${darkMode ? "bg-[#050e1d] border-[#D4A017]/30" : "bg-[#152a50] border-transparent"}
        hover:border-[#D4A017] group
      `}
    >
      <div className="flex items-center gap-3">
        <div
          className={`
            w-8 h-8 rounded-full flex items-center justify-center transition-all duration-500
            ${darkMode ? "bg-[#D4A017] text-[#0B1C39]" : "bg-white/10 text-[#D4A017]"}
          `}
        >
          {darkMode ? (
            // Moon Icon
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
            </svg>
          ) : (
            // Sun Icon
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
          )}
        </div>
        <span className={`text-sm font-medium transition-colors ${darkMode ? "text-[#D4A017]" : "text-white"}`}>
          {darkMode ? "Dark Mode" : "Light Mode"}
        </span>
      </div>
      
      {/* Switch Indicator */}
      <div className={`w-8 h-4 rounded-full relative transition-colors duration-300 ${darkMode ? 'bg-[#D4A017]/20' : 'bg-black/30'}`}>
        <div className={`absolute top-0.5 w-3 h-3 rounded-full bg-[#D4A017] transition-all duration-300 shadow-sm ${darkMode ? 'left-4.5' : 'left-0.5'}`} style={{ left: darkMode ? 'calc(100% - 14px)' : '2px' }}></div>
      </div>
    </button>
  );

  return (
    <>
      {/* Mobile: keep small floating hamburger; show slide-in sidebar when opened */}
      <div className="md:hidden">
        {/* Floating hamburger (kept in same place) */}
        <button
          aria-controls="mobile-slide"
          aria-expanded={open}
          aria-label={open ? "Close menu" : "Open menu"}
          onClick={() => setOpen((s) => !s)}
          className="fixed top-4 left-4 z-50 p-3 rounded-full bg-[#0B1C39] text-[#D4A017] border-2 border-white/10 shadow-lg focus:outline-none focus:ring-2 focus:ring-[#D4A017]"
        >
          {!open ? (
            <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
              <rect x="3" y="5" width="18" height="2" rx="1" fill="currentColor" />
              <rect x="3" y="11" width="14" height="2" rx="1" fill="currentColor" />
              <rect x="3" y="17" width="10" height="2" rx="1" fill="currentColor" />
            </svg>
          ) : (
            <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
              <path d="M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M6 18L18 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          )}
        </button>

        {/* Overlay to dim page and capture outside clicks */}
        {open && <div onClick={() => setOpen(false)} className="fixed inset-0 z-40 bg-black/40" />}

        {/* Slide-in sidebar panel from left with reduced width */}
        <aside
          id="mobile-slide"
          className={`fixed top-0 left-0 h-full z-50 transform ${open ? "translate-x-0" : "-translate-x-full"} transition-transform duration-200 ease-in-out bg-[#0B1C39] text-white shadow-lg p-5 w-64 flex flex-col`}
          role="dialog"
          aria-modal="true"
        >
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <span className="w-9 h-9 rounded-full bg-[#D4A017] flex items-center justify-center text-[#0B1C39] font-bold">L</span>
              <span className="text-lg font-semibold text-[#D4A017]">Lawyer Panel</span>
            </div>
            <button onClick={() => setOpen(false)} className="p-2 rounded-md bg-white/5 hover:bg-white/10">
              <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M6 18L18 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          </div>

          <nav className="flex-1 flex flex-col gap-2">
            {links.map((item) => {
              const active = pathname === item.href;
              return (
                <button
                  key={item.href}
                  type="button"
                  onClick={() => {
                    setOpen(false);
                    router.push(item.href);
                  }}
                  className={`w-full text-left px-3 py-2 rounded-md text-sm font-medium ${
                    active ? "bg-white/5 font-semibold" : "text-white/90"
                  } transition-all duration-200 transform-gpu hover:scale-105 hover:rounded-2xl hover:bg-[#D4A017] hover:text-[#0B1C39] hover:shadow-lg`}
                >
                  {item.name}
                </button>
              );
            })}
          </nav>

          {/* Mobile Dark Mode Toggle */}
          <div className="mt-auto border-t border-white/10 pt-4">
             <ThemeToggle />
          </div>
        </aside>
      </div>

      {/* Desktop sidebar */}
      <aside className="hidden md:flex flex-col w-64 bg-[#0B1C39] text-white shadow-md p-6 min-h-screen">
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
        
        <nav className="flex-1 space-y-3">
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

        {/* Desktop Dark Mode Toggle */}
        <div className="mt-auto pt-6 border-t border-[#D4A017]/20">
          <ThemeToggle />
        </div>
      </aside>
    </>
  );
}