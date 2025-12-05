export default function ProfileCard({ user }) {
  return (
    <div className="bg-white rounded-xl shadow p-6 border border-gray-100">
      <h2 className="text-xl font-semibold text-[#0B1C39] font-serif">
        {user.name}
      </h2>

      <p className="text-gray-600 mt-1">{user.email}</p>

      <div className="mt-4 p-3 rounded-lg bg-[#0B1C39]/5 border-l-4 border-[#D4A017]">
        <p className="text-sm text-[#0B1C39]/90">
          <span className="font-medium">User ID:</span> {user._id}
        </p>
      </div>
    </div>
  );
}
