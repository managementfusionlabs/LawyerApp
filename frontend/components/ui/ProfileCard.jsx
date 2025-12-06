export default function ProfileCard({ user }) {
  return (
    <div className="space-y-4">
      {/* Profile Image */}
      {user.profileImage && (
        <img
          src={user.profileImage}
          alt="Profile"
          className="w-32 h-32 object-cover rounded-xl border-2 border-[#D4A017]"
        />
      )}

      <div>
        <h2 className="text-xl font-bold text-[#0B1C39]">{user.name}</h2>
        {user.title && <p className="text-gray-600">{user.title}</p>}
      </div>

      {user.shortBio && (
        <p className="text-gray-700">{user.shortBio}</p>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {user.phone && <p><strong>Phone: </strong>{user.phone}</p>}
        {user.officeAddress && <p><strong>Office: </strong>{user.officeAddress}</p>}
        {user.website && (
          <p>
            <strong>Website: </strong>
            <a href={user.website} target="_blank" className="text-[#0B1C39] underline">
              {user.website}
            </a>
          </p>
        )}
        {user.yearsOfExperience && (
          <p><strong>Experience: </strong>{user.yearsOfExperience} years</p>
        )}
      </div>

      {/* Arrays */}
      <div className="space-y-2">
        {user.practiceAreas?.length > 0 && (
          <p><strong>Practice Areas:</strong> {user.practiceAreas.join(", ")}</p>
        )}

        {user.jurisdictions?.length > 0 && (
          <p><strong>Jurisdictions:</strong> {user.jurisdictions.join(", ")}</p>
        )}

        {user.languages?.length > 0 && (
          <p><strong>Languages:</strong> {user.languages.join(", ")}</p>
        )}

        {user.awards?.length > 0 && (
          <p><strong>Awards:</strong> {user.awards.join(", ")}</p>
        )}

        {user.memberships?.length > 0 && (
          <p><strong>Memberships:</strong> {user.memberships.join(", ")}</p>
        )}
      </div>

      {/* Admissions */}
      {user.admissions?.length > 0 && (
        <div>
          <strong>Bar Admissions:</strong>
          <ul className="list-disc ml-5 text-gray-700">
            {user.admissions.map((a, i) => (
              <li key={i}>
                {a.jurisdiction} — {a.barNumber || "N/A"} ({a.admittedYear || "?"})
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Education */}
      {user.education?.length > 0 && (
        <div>
          <strong>Education:</strong>
          <ul className="list-disc ml-5 text-gray-700">
            {user.education.map((e, i) => (
              <li key={i}>{e.school} — {e.degree} ({e.year})</li>
            ))}
          </ul>
        </div>
      )}

      {/* Publications */}
      {user.publications?.length > 0 && (
        <div>
          <strong>Publications:</strong>
          <ul className="list-disc ml-5 text-gray-700">
            {user.publications.map((p, i) => (
              <li key={i}>
                {p.link ? (
                  <a href={p.link} target="_blank" className="text-[#0B1C39] underline">
                    {p.title}
                  </a>
                ) : (
                  p.title
                )}
              </li>
            ))}
          </ul>
        </div>
      )}

      {user.longBio && (
        <div>
          <strong>About:</strong>
          <p className="text-gray-700 mt-1">{user.longBio}</p>
        </div>
      )}
    </div>
  );
}
