"use client";

export default function Navbar() {
  return (
    <header className="w-full bg-white shadow px-4 py-3 flex justify-between items-center md:px-6">
      <h1 className="text-lg md:text-xl font-semibold">Dashboard</h1>

      <button
        onClick={async () => {
          await fetch(`${process.env.NEXT_PUBLIC_API}/auth/logout`, {
            method: "POST",
            credentials: "include",
          });
          window.location.href = "/auth/login";
        }}
        className="px-3 py-1.5 bg-black text-white text-sm rounded-md md:text-base"
      >
        Logout
      </button>
    </header>
  );
}
