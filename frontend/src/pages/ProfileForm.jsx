// src/pages/ProfileForm.jsx
import { useApp } from "../context/AppContext";
import { useNavigate } from "react-router-dom";

export default function ProfileForm() {
  const { profile, setProfile } = useApp();
  const nav = useNavigate();

  const update = (key, val) =>
    setProfile((prev) => ({ ...prev, [key]: val }));

  const updateSocial = (key, val) =>
    setProfile((prev) => ({
      ...prev,
      socials: { ...prev.socials, [key]: val },
    }));

  const submit = (e) => {
    e.preventDefault();
    nav("/create");
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <form
        onSubmit={submit}
        className="bg-white rounded-3xl border shadow-lg p-8 space-y-10"
      >
        {/* Header */}
        <div>
          <h2 className="text-3xl font-bold">Build your profile</h2>
          <p className="mt-2 text-gray-600">
            This information will appear on your digital card.
          </p>
        </div>

        {/* Profile Photo */}
        <section>
          <h3 className="text-lg font-semibold mb-4">Profile photo</h3>
          <div className="flex items-center gap-6">
            <div className="w-28 h-28 rounded-full border overflow-hidden bg-gray-50 flex items-center justify-center">
              {profile.photo ? (
                <img
                  src={profile.photo}
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-gray-400 text-sm">No photo</span>
              )}
            </div>

            <label className="cursor-pointer">
              <span className="px-4 py-2 border rounded-xl text-sm font-medium hover:bg-gray-50">
                Upload photo
              </span>
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files[0];
                  if (!file) return;
                  const reader = new FileReader();
                  reader.onloadend = () =>
                    setProfile((prev) => ({
                      ...prev,
                      photo: reader.result,
                    }));
                  reader.readAsDataURL(file);
                }}
              />
            </label>
          </div>
        </section>

        {/* Basic Info */}
        <section>
          <h3 className="text-lg font-semibold mb-4">Basic information</h3>
          <div className="grid md:grid-cols-2 gap-6">
            <Input
              label="Full name"
              placeholder="John Doe"
              value={profile.fullName}
              onChange={(v) => update("fullName", v)}
            />
            <Input
              label="Title"
              placeholder="Frontend Developer"
              value={profile.title}
              onChange={(v) => update("title", v)}
            />
            <Input
              label="Email"
              placeholder="john@example.com"
              value={profile.email}
              onChange={(v) => update("email", v)}
            />
            <Input
              label="Phone"
              placeholder="+91 98765 43210"
              value={profile.phone}
              onChange={(v) => update("phone", v)}
            />
          </div>
        </section>

        {/* Social Links */}
        <section>
          <h3 className="text-lg font-semibold mb-4">Social links</h3>
          <div className="grid md:grid-cols-2 gap-6">
            <Input
              label="Twitter"
              placeholder="https://twitter.com/username"
              value={profile.socials.twitter}
              onChange={(v) => updateSocial("twitter", v)}
            />
            <Input
              label="LinkedIn"
              placeholder="https://linkedin.com/in/username"
              value={profile.socials.linkedin}
              onChange={(v) => updateSocial("linkedin", v)}
            />
            <Input
              label="GitHub"
              placeholder="https://github.com/username"
              value={profile.socials.github}
              onChange={(v) => updateSocial("github", v)}
            />
            <Input
              label="Website"
              placeholder="https://yourwebsite.com"
              value={profile.socials.website}
              onChange={(v) => updateSocial("website", v)}
            />
          </div>
        </section>

        {/* Navigation */}
        <div className="flex justify-between pt-6 border-t">
          <button
            type="button"
            onClick={() => nav("/pricing")}
            className="px-5 py-2.5 rounded-xl border hover:bg-gray-50"
          >
            Back
          </button>
          <button
            type="submit"
            className="px-6 py-2.5 rounded-xl bg-blue-600 text-white font-semibold hover:bg-blue-700"
          >
            Next: Customize card
          </button>
        </div>
      </form>
    </div>
  );
}

function Input({ label, placeholder, value, onChange }) {
  return (
    <label className="block">
      <span className="text-sm font-medium text-gray-700">{label}</span>
      <input
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="mt-1 w-full rounded-xl border px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-600"
      />
    </label>
  );
}
