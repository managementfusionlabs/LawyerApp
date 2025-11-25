export default function ForgotPassword() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F9FAFB] bg-[radial-gradient(ellipse_at_center,rgba(10,26,47,0.06),rgba(10,26,47,0))] py-20 md:py-28 px-6 md:px-12">
      <div className="relative bg-gradient-to-br from-white/95 to-[#EEF3F8] backdrop-blur-sm rounded-2xl p-6 md:p-8 max-w-md w-full shadow-2xl ring-1 ring-gray-100 transition-all duration-300 hover:shadow-[0_25px_50px_rgba(10,26,47,0.15)] hover:scale-[1.015] border-l-4 border-[#D4A017]">
        <h2 className="text-2xl md:text-3xl font-extrabold font-serif text-[#0A1A2F] tracking-wide mb-3">Reset Password</h2>
        <p className="text-sm text-gray-600 mb-6">Enter your email and we'll send you a secure link to reset your password.</p>

        <label className="block text-sm font-medium text-[#0B1C39] mb-2">Email address</label>
        <input placeholder="you@company.com" className="w-full p-3 rounded-xl border border-gray-200 bg-white text-[#0B1C39] focus:ring-2 focus:ring-[#D4A017] focus:border-[#0B1C39] focus:shadow-sm outline-none transition mb-4" />

        <button className="w-full bg-[#0B1C39] text-white font-semibold px-6 py-3 rounded-xl shadow-sm transition-all duration-200 transform-gpu hover:scale-105 hover:rounded-2xl hover:bg-[#D4A017] hover:text-[#0B1C39] hover:shadow-lg border-2 border-[#D4A017]">Send Reset Link</button>
      </div>
    </div>
  );
}
