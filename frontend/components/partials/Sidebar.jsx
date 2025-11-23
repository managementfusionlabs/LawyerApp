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

  return (
    <>
      {/* Mobile top bar */}
      <div className="md:hidden flex items-center justify-between bg-white p-3 shadow">
        <div className="text-lg font-bold">Lawyer Panel</div>
        <button onClick={() => setOpen(!open)} className="p-2 rounded border">
          ☰
        </button>
      </div>

      {/* Mobile drawer */}
      {open && (
        <div className="md:hidden bg-white shadow p-4">
          <nav className="space-y-2">
            {links.map((item) => (
              <Link key={item.href} href={item.href} onClick={() => setOpen(false)} className={`block p-2 rounded ${pathname === item.href ? "bg-black text-white" : "hover:bg-gray-100"}`}>
                {item.name}
              </Link>
            ))}
          </nav>
        </div>
      )}

      {/* Desktop sidebar */}
      <aside className="hidden md:block w-64 bg-white shadow-md p-6 min-h-screen">
        <h2 className="font-bold text-2xl mb-8 tracking-wide">Lawyer Panel</h2>
        <nav className="space-y-3">
          {links.map((item) => {
            const active = pathname === item.href;
            return (
              <Link key={item.href} href={item.href} className={`block p-3 rounded-lg text-sm font-medium ${active ? "bg-black text-white" : "text-gray-700 hover:bg-gray-100"}`}>
                {item.name}
              </Link>
            );
          })}
        </nav>
      </aside>
    </>
  );
}
