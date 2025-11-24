"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const res = await fetch(`${process.env.NEXT_PUBLIC_API}/auth/register`, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(form),
    });

    const data = await res.json();
    setLoading(false);

    if (!res.ok) {
      setError(data.error || "Something went wrong");
      return;
    }

    router.push("/dashboard");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F9FAFB] bg-[radial-gradient(ellipse_at_center,rgba(10,26,47,0.06),rgba(10,26,47,0))] py-20 md:py-28 px-6 md:px-12">
      <div className="w-full max-w-md bg-gradient-to-br from-white/95 to-[#EEF3F8] backdrop-blur-sm rounded-2xl p-6 md:p-8 shadow-2xl ring-1 ring-gray-100 transition-all duration-300 hover:shadow-[0_25px_50px_rgba(10,26,47,0.15)] hover:scale-[1.015] border-l-4 border-[#D4A017]">
        <h2 className="text-3xl md:text-4xl font-extrabold font-serif text-[#0A1A2F] tracking-wide text-center">Create Account</h2>
        <p className="text-center text-gray-600 mt-1 mb-6 text-sm">Join LegalJK to manage your cases easily</p>

        <form onSubmit={submit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-[#0A1A2F]">Full Name</label>
            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="Your full name"
              required
              className="mt-1 w-full p-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-[#D4A017] focus:border-[#0B1C39] focus:shadow-sm outline-none transition bg-white"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-[#0A1A2F]">Email</label>
            <input
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              placeholder="email@example.com"
              required
              className="mt-1 w-full p-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-[#D4A017] focus:border-[#0B1C39] focus:shadow-sm outline-none transition bg-white"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-[#0A1A2F]">Password</label>
            <input
              name="password"
              type="password"
              value={form.password}
              onChange={handleChange}
              placeholder="********"
              required
              className="mt-1 w-full p-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-[#D4A017] focus:border-[#0B1C39] focus:shadow-sm outline-none transition bg-white"
            />
          </div>

          {error && (
            <p className="text-red-600 text-sm bg-red-50 p-2 rounded-xl">{error}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#0B1C39] text-white font-semibold px-6 py-3 rounded-xl shadow-sm transition-all duration-200 transform-gpu hover:scale-105 hover:rounded-2xl hover:bg-[#D4A017] hover:text-[#0B1C39] hover:shadow-lg border-2 border-[#D4A017]"
          >
            {loading ? "Creating account..." : "Register"}
          </button>
        </form>

        <p className="text-center text-sm mt-6">
          Already have an account?{" "}
          <a href="/auth/login" className="text-[#0A1A2F] font-semibold hover:text-[#D4A017] transition duration-200">
            Login
          </a>
        </p>
      </div>
    </div>
  );
}
