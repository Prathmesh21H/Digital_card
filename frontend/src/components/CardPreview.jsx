// src/components/CardPreview.jsx
import { useApp } from "../context/AppContext";
import { forwardRef } from "react";

const CardPreview = forwardRef(function CardPreview(props, ref) {
  const { profile, card } = useApp();
  const { template, font, colors, showSections } = card;

  const isBold = template === "bold";
  const isMinimal = template === "minimal";

  return (
    <div
      ref={ref}
      className={`relative w-full max-w-lg mx-auto rounded-3xl shadow-xl transition-all duration-300 ${
        isBold ? "border-[5px]" : "border"
      }`}
      style={{
        borderColor: colors.accent,
        backgroundColor: colors.bg,
        color: colors.primary,
        fontFamily: font,
      }}
    >
      {/* Accent strip */}
      {!isMinimal && (
        <div
          className="h-3 w-full rounded-t-3xl"
          style={{ backgroundColor: colors.accent }}
        />
      )}

      <div className={`px-10 pb-10 ${isMinimal ? "pt-14" : "pt-10"}`}>
        {/* Profile Image */}
        {profile.photo && (
          <div className="flex justify-center -mt-20 mb-6">
            <img
              src={profile.photo}
              alt="Profile"
              crossOrigin="anonymous"
              className="w-36 h-36 object-cover rounded-full border-[5px] shadow-lg bg-white"
              style={{ borderColor: colors.bg }}
            />
          </div>
        )}

        {/* Name & Title */}
        <div className="text-center">
          <h3 className="text-3xl font-extrabold tracking-tight">
            {profile.fullName || "Your Name"}
          </h3>
          <p className="text-base opacity-70 mt-2">
            {profile.title || "Your Professional Title"}
          </p>
        </div>

        {/* Divider */}
        <div
          className="my-6 h-px w-full opacity-30"
          style={{ backgroundColor: colors.primary }}
        />

        {/* Contact Info */}
        {showSections.about && (
          <div className="space-y-2 text-base text-center opacity-80">
            {profile.email && <p>📧 {profile.email}</p>}
            {profile.phone && <p>📞 {profile.phone}</p>}
          </div>
        )}

        {/* Social Links */}
        {showSections.socials && (
          <div className="mt-8 flex justify-center flex-wrap gap-3">
            {Object.entries(profile.socials).map(
              ([platform, url]) =>
                url && (
                  <a
                    key={platform}
                    href={url}
                    target="_blank"
                    rel="noreferrer"
                    className="px-5 py-2 rounded-full text-sm font-medium border transition-all hover:scale-105 hover:shadow-sm"
                    style={{ borderColor: colors.accent }}
                  >
                    {platform}
                  </a>
                )
            )}
          </div>
        )}

        {/* CTA Button */}
        {showSections.contact && (
          <div className="mt-10 flex justify-center">
            <button
              className="px-10 py-3 rounded-full text-base font-semibold shadow-lg transition hover:opacity-90"
              style={{ backgroundColor: colors.accent, color: "#fff" }}
            >
              Contact Me
            </button>
          </div>
        )}
      </div>
    </div>
  );
});

export default CardPreview;
