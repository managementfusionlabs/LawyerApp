export default function ForgotPassword() {
  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-gray-100">
      <div className="bg-white p-8 rounded-xl shadow max-w-md w-full">
        <h2 className="text-xl font-bold mb-4">Reset Password</h2>
        <p className="text-sm text-gray-600 mb-4">
          Enter your email and we'll send you a link to reset your password.
        </p>
        <input placeholder="Email" className="w-full p-3 border rounded bg-gray-50 mb-4" />
        <button className="w-full bg-black text-white p-3 rounded">Send Reset Link</button>
      </div>
    </div>
  );
}
