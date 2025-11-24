"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import FloatingInput from "@/components/ui/FloatingInput";
import PasswordInput from "@/components/ui/PasswordInput";
import Checkbox from "@/components/ui/Checkbox";
import Loader from "@/components/ui/Loader";

export default function LoginPage() {
  const router = useRouter();

  const [form, setForm] = useState({
    email: "",
    password: "",
    remember: false,
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({
      ...form,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const res = await fetch(`${process.env.NEXT_PUBLIC_API}/auth/login`, {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    const data = await res.json();
    setLoading(false);

    if (!res.ok) {
      setError(data.error || "Invalid email or password");
      return;
    }

    router.push("/dashboard");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F9FAFB] bg-[radial-gradient(ellipse_at_center,rgba(11,28,57,0.06),rgba(11,28,57,0))] py-20 md:py-28 px-6 md:px-12">
      <div className="relative bg-gradient-to-br from-white/95 to-[#F3F7FA] backdrop-blur-sm rounded-2xl p-8 md:p-10 w-full max-w-md shadow-xl ring-1 ring-gray-100 transition-all duration-300 hover:shadow-2xl hover:scale-[1.02] border-l-4 border-[#D4AF37]">

        <h1 className="text-3xl md:text-4xl font-serif font-extrabold text-[#0B1C39] tracking-wide text-center">Welcome Back</h1>
        <p className="text-gray-600 text-center mb-6">Login to continue</p>

        <form onSubmit={submit} className="space-y-5">
          <FloatingInput
            name="email"
            label="Email Address"
            value={form.email}
            onChange={handleChange}
            required
            className="w-full"
          />

          <PasswordInput
            name="password"
            label="Password"
            value={form.password}
            onChange={handleChange}
            required
            className="w-full"
          />

          <div className="flex items-center justify-between">
            <Checkbox
              name="remember"
              label="Remember me"
              checked={form.remember}
              onChange={handleChange}
            />
            <a href="/auth/forgot" className="text-sm font-medium text-[#0A1A2F] hover:text-[#D4A017] transition duration-200">
              Forgot password?
            </a>
          </div>

          {error && (
            <p className="text-red-600 bg-red-50 p-2 rounded-xl text-sm">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#0B1C39] text-white font-semibold px-6 py-3 rounded-xl shadow-sm transition-all duration-200 transform-gpu hover:scale-105 hover:rounded-2xl hover:bg-[#D4A017] hover:text-[#0B1C39] hover:shadow-lg border-2 border-[#D4A017]"
          >
            {loading ? <Loader text="Logging in..." /> : "Login"}
          </button>
        </form>

        <p className="text-center mt-6 text-sm">
          Don’t have an account?{" "}
          <a className="text-[#0A1A2F] font-semibold hover:text-[#D4A017] transition duration-200" href="/auth/register">
            Register
          </a>
        </p>

      </div>
    </div>
  );
}
