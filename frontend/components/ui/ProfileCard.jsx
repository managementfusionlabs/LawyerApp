import React from 'react';

// Simple icons to enhance the premium feel without external libraries
const Icons = {
  Phone: () => <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/></svg>,
  Map: () => <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/></svg>,
  Globe: () => <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9"/></svg>,
  Link: () => <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"/></svg>
};

export default function ProfileCard({ user }) {
  // Helper for Section Headers
  const SectionHeader = ({ title }) => (
    <h3 className="text-xs font-bold uppercase tracking-widest text-[#D4A017] mb-3 border-b border-[#D4A017]/20 pb-1">
      {title}
    </h3>
  );

  return (
    <div className="w-full max-w-4xl mx-auto bg-white rounded-xl md:rounded-2xl shadow-xl overflow-hidden border border-[#D4A017]/30">
      
      {/* --- HEADER SECTION --- */}
      {/* Reduced padding on mobile (p-6) vs desktop (p-8) */}
      <div className="relative bg-[#F8F8F8] p-6 md:p-8 flex flex-col items-center text-center border-b border-[#D4A017]/20">
        
        {/* Decorative top accent */}
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#0B1C39] via-[#D4A017] to-[#0B1C39]"></div>

        {/* Circular Image with Double Border */}
        <div className="relative mb-4">
          {/* Smaller image on mobile (w-28) to save space, larger on desktop (w-36) */}
          <div className="w-28 h-28 md:w-36 md:h-36 rounded-full p-1 bg-white border border-[#D4A017] shadow-lg transition-all duration-300">
            <img
              src={user.profileImage || "/default-avatar.png"}
              alt="Profile"
              className="w-full h-full object-cover rounded-full"
              onError={(e) => {
                if (e.target.src !== window.location.origin + "/default-avatar.png") {
                  e.target.src = "/default-avatar.png";
                }
              }}
            />
          </div>
        </div>

        {/* Name & Titles */}
        {/* Slightly smaller text on mobile */}
        <h2 className="text-2xl md:text-3xl font-bold text-[#0B1C39] mb-1">{user.name}</h2>
        
        {user.title && (
          <p className="text-[#D4A017] font-medium text-base md:text-lg mb-1">{user.title}</p>
        )}
        
        {user.clientFacingName && (
          <p className="text-gray-400 text-xs md:text-sm italic">
            Known as: {user.clientFacingName}
          </p>
        )}

        {/* Short Bio */}
        {user.shortBio && (
          <p className="text-gray-600 mt-3 md:mt-4 text-sm md:text-base max-w-xl leading-relaxed">
            {user.shortBio}
          </p>
        )}
      </div>

      {/* --- MAIN CONTENT GRID --- */}
      {/* Tighter padding on mobile (p-5) to widen content area */}
      <div className="p-5 md:p-8 space-y-6 md:space-y-8">
        
        {/* Two Column Layout for Contact & Professional Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
          
          {/* CONTACT DETAILS */}
          <div className="space-y-3">
            <SectionHeader title="Contact Information" />
            
            <div className="space-y-3 text-sm text-[#0B1C39]">
              {user.phone && (
                <div className="flex items-center gap-3">
                  <span className="text-[#D4A017] shrink-0"><Icons.Phone /></span>
                  <span className="break-all">{user.phone}</span>
                </div>
              )}
              {user.officeAddress && (
                <div className="flex items-start gap-3">
                  <span className="text-[#D4A017] mt-0.5 shrink-0"><Icons.Map /></span>
                  <span>{user.officeAddress}</span>
                </div>
              )}
              {user.website && (
                <div className="flex items-center gap-3">
                  <span className="text-[#D4A017] shrink-0"><Icons.Globe /></span>
                  <a href={user.website} target="_blank" rel="noreferrer" className="hover:text-[#D4A017] transition-colors underline decoration-[#D4A017]/30 break-all">
                    {user.website}
                  </a>
                </div>
              )}
              {user.social?.linkedin && (
                <div className="flex items-center gap-3">
                  <span className="text-[#D4A017] shrink-0"><Icons.Link /></span>
                  <a href={user.social.linkedin} target="_blank" rel="noreferrer" className="hover:text-[#D4A017] transition-colors">
                    LinkedIn Profile
                  </a>
                </div>
              )}
               {user.social?.twitter && (
                <div className="flex items-center gap-3">
                  <span className="text-[#D4A017] shrink-0"><Icons.Link /></span>
                  <a href={user.social.twitter} target="_blank" rel="noreferrer" className="hover:text-[#D4A017] transition-colors">
                    Twitter Profile
                  </a>
                </div>
              )}
            </div>
          </div>

          {/* PROFESSIONAL DETAILS */}
          <div className="space-y-3">
             <SectionHeader title="Professional Summary" />
            
            <div className="space-y-2 text-sm">
              {user.yearsOfExperience && (
                <div className="flex justify-between border-b border-dashed border-gray-200 pb-1">
                  <span className="text-gray-500">Experience</span>
                  <span className="font-semibold text-[#0B1C39] text-right">{user.yearsOfExperience} Years</span>
                </div>
              )}
              {user.consultationFee && (
                <div className="flex justify-between border-b border-dashed border-gray-200 pb-1">
                  <span className="text-gray-500">Consultation</span>
                  <span className="font-semibold text-[#0B1C39] text-right">{user.consultationFee}</span>
                </div>
              )}
              
              {user.practiceAreas?.length > 0 && (
                <div className="pt-2">
                  <span className="block text-gray-500 mb-1">Practice Areas</span>
                  <div className="flex flex-wrap gap-2">
                    {user.practiceAreas.map((area, i) => (
                      <span key={i} className="px-2 py-1 bg-[#F8F8F8] text-[#0B1C39] text-xs font-medium border border-[#D4A017]/20 rounded">
                        {area}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* --- FULL WIDTH SECTIONS --- */}

        {/* ABOUT (LONG BIO) */}
        {user.longBio && (
          <div>
            <SectionHeader title="About" />
            <p className="text-gray-700 leading-relaxed text-sm whitespace-pre-line">
              {user.longBio}
            </p>
          </div>
        )}

        {/* EDUCATION & ADMISSIONS GRID */}
        {(user.education?.length > 0 || user.admissions?.length > 0) && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 pt-4 border-t border-[#D4A017]/10">
            
            {/* EDUCATION */}
            {user.education?.length > 0 && (
              <div>
                <SectionHeader title="Education" />
                <ul className="space-y-4">
                  {user.education.map((e, i) => (
                    <li key={i} className="flex flex-col">
                      <span className="font-bold text-[#0B1C39]">{e.school}</span>
                      <span className="text-sm text-gray-600">{e.degree}</span>
                      <span className="text-xs text-[#D4A017] mt-0.5">{e.year}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* ADMISSIONS */}
            {user.admissions?.length > 0 && (
              <div>
                <SectionHeader title="Bar Admissions" />
                <ul className="space-y-2">
                  {user.admissions.map((a, i) => (
                    <li key={i} className="flex justify-between items-start text-sm">
                      <span className="text-[#0B1C39] font-medium">{a.jurisdiction}</span>
                      <div className="text-right ml-2">
                        <span className="block text-gray-500 text-xs whitespace-nowrap">{a.barNumber || "N/A"}</span>
                        <span className="block text-[#D4A017] text-xs">{a.admittedYear}</span>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}

        {/* AWARDS & PUBLICATIONS GRID */}
        {(user.awards?.length > 0 || user.publications?.length > 0) && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 pt-4 border-t border-[#D4A017]/10">
            
            {/* AWARDS */}
            {user.awards?.length > 0 && (
              <div className="bg-[#F8F8F8] p-4 md:p-5 rounded-xl border border-[#D4A017]/10">
                <SectionHeader title="Honors & Awards" />
                <ul className="space-y-2 mt-2">
                  {user.awards.map((award, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-gray-700">
                      <span className="text-[#D4A017] mt-1 shrink-0">★</span>
                      <span>{award}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* PUBLICATIONS */}
            {user.publications?.length > 0 && (
              <div className="bg-[#F8F8F8] p-4 md:p-5 rounded-xl border border-[#D4A017]/10">
                <SectionHeader title="Publications" />
                <ul className="space-y-2 mt-2">
                  {user.publications.map((p, i) => (
                    <li key={i} className="text-sm">
                      {p.link ? (
                        <a href={p.link} target="_blank" rel="noreferrer" className="text-[#0B1C39] hover:text-[#D4A017] font-medium underline decoration-[#D4A017]/30 transition-colors">
                          {p.title}
                        </a>
                      ) : (
                        <span className="text-gray-700 font-medium">{p.title}</span>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}