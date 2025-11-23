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
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="bg-white w-full max-w-md p-8 rounded-xl shadow-lg border">
        
        <h1 className="text-3xl font-bold text-center">Welcome Back</h1>
        <p className="text-gray-600 text-center mb-6">Login to continue</p>

        <form onSubmit={submit} className="space-y-5">
          <FloatingInput
            name="email"
            label="Email Address"
            value={form.email}
            onChange={handleChange}
            required
          />

          <PasswordInput
            name="password"
            label="Password"
            value={form.password}
            onChange={handleChange}
            required
          />

          <div className="flex items-center justify-between">
            <Checkbox
              name="remember"
              label="Remember me"
              checked={form.remember}
              onChange={handleChange}
            />
            <a href="/auth/forgot" className="text-sm font-medium text-black">
              Forgot password?
            </a>
          </div>

          {error && (
            <p className="text-red-600 bg-red-100 p-2 rounded text-sm">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-black text-white py-3 rounded-lg font-semibold hover:bg-gray-900 transition"
          >
            {loading ? <Loader text="Logging in..." /> : "Login"}
          </button>
        </form>

        <p className="text-center mt-6 text-sm">
          Don’t have an account?{" "}
          <a className="text-black font-semibold" href="/auth/register">
            Register
          </a>
        </p>

      </div>
    </div>
  );
}
