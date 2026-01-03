"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/lib/firebase"; // Using initialized auth instance
import { cardAPI, setAuthToken } from "@/lib/api";
import { CardPreview } from "@/components/CardPreview";
import {
  ArrowLeft,
  Save,
  Loader2,
  AlertTriangle,
  User,
  Palette,
  Trash2,
} from "lucide-react";

export default function EditCardPage() {
  const { cardId } = useParams();
  const router = useRouter();

  const [form, setForm] = useState({
    fullName: "",
    designation: "",
    company: "",
    bio: "",
    profileUrl: "",
    banner: { type: "color", value: "" },
    cardSkin: null,
    layout: "",
    fontStyle: "",
    phone: "",
    email: "",
    website: "",
    linkedin: "",
    twitter: "",
    instagram: "",
    facebook: "",
  });

  const [activeTab, setActiveTab] = useState("content");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        const token = await firebaseUser.getIdToken();
        setAuthToken(token);
        loadCard();
      } else {
        router.push("/");
      }
    });
    return () => unsubscribe();
  }, [cardId]);

  async function loadCard() {
    try {
      const data = await cardAPI.getCardById(cardId);
      setForm({
        ...data,
        // Ensure nested objects like banner have defaults if missing
        banner: data.banner || { type: "color", value: "#2563eb" },
      });
    } catch (err) {
      console.error(err);
      setError(
        "We couldn't find this card or you don't have permission to edit it."
      );
    } finally {
      setLoading(false);
    }
  }

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSave() {
    setSaving(true);
    setError("");
    try {
      await cardAPI.updateCard(cardId, form);
      router.push("/dashboard");
    } catch (err) {
      setError("Failed to save changes. Please try again.");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    setDeleting(true);
    try {
      await cardAPI.deleteCard(cardId);
      router.push("/dashboard");
    } catch (err) {
      setError("Failed to delete card. Please try again.");
      setShowDeleteConfirm(false);
    } finally {
      setDeleting(false);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50">
        <Loader2 className="animate-spin text-blue-600 mb-4" size={40} />
        <p className="text-slate-500 font-medium">
          Loading your card design...
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-[2rem] w-full max-w-md p-8 shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="bg-red-50 w-16 h-16 rounded-full flex items-center justify-center mb-6 text-red-600">
              <AlertTriangle size={32} />
            </div>
            <h3 className="text-2xl font-bold text-slate-900 mb-2">
              Delete Card?
            </h3>
            <p className="text-slate-500 mb-8">
              This action cannot be undone. Your public link will stop working
              and all data for this card will be permanently removed.
            </p>
            <div className="flex flex-col gap-3">
              <button
                onClick={handleDelete}
                disabled={deleting}
                className="w-full bg-red-600 text-white py-4 rounded-2xl font-bold hover:bg-red-700 transition-colors flex items-center justify-center gap-2"
              >
                {deleting ? (
                  <Loader2 className="animate-spin" size={20} />
                ) : (
                  "Yes, Delete Card"
                )}
              </button>
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="w-full bg-slate-100 text-slate-600 py-4 rounded-2xl font-bold hover:bg-slate-200 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md border-b border-slate-200 py-4 px-6 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-slate-600 hover:text-slate-900 font-semibold transition-colors"
          >
            <ArrowLeft size={20} />{" "}
            <span className="hidden sm:inline">Back</span>
          </button>

          <div className="flex items-center gap-3">
            <button
              onClick={handleSave}
              disabled={saving}
              className="flex items-center gap-2 bg-blue-600 text-white px-6 py-2.5 rounded-2xl font-bold hover:bg-blue-700 transition-all disabled:opacity-50 shadow-lg shadow-blue-200"
            >
              {saving ? (
                <Loader2 className="animate-spin" size={18} />
              ) : (
                <Save size={18} />
              )}
              {saving ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-7xl mx-auto w-full p-4 lg:p-8 flex flex-col lg:flex-row gap-10">
        {/* Editor Panel */}
        <div className="w-full lg:w-3/5 space-y-6">
          <div className="bg-white rounded-[2.5rem] border border-slate-200 shadow-sm overflow-hidden">
            <div className="flex border-b border-slate-100 bg-slate-50/50">
              <button
                onClick={() => setActiveTab("content")}
                className={`flex-1 flex items-center justify-center gap-2 py-5 text-sm font-bold transition-all border-b-2 ${
                  activeTab === "content"
                    ? "border-blue-600 text-blue-600 bg-white"
                    : "border-transparent text-slate-400"
                }`}
              >
                <User size={18} /> Content
              </button>
              <button
                onClick={() => setActiveTab("design")}
                className={`flex-1 flex items-center justify-center gap-2 py-5 text-sm font-bold transition-all border-b-2 ${
                  activeTab === "design"
                    ? "border-blue-600 text-blue-600 bg-white"
                    : "border-transparent text-slate-400"
                }`}
              >
                <Palette size={18} /> Design
              </button>
            </div>

            <div className="p-8 lg:p-10">
              {error && (
                <div className="mb-6 p-4 bg-red-50 text-red-600 border border-red-100 rounded-2xl text-sm">
                  {error}
                </div>
              )}

              {activeTab === "content" ? (
                // --- CONTENT TAB ---
                <div className="space-y-8 animate-in fade-in duration-300">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input
                      label="Full Name"
                      name="fullName"
                      value={form.fullName}
                      onChange={handleChange}
                    />
                    <Input
                      label="Designation"
                      name="designation"
                      value={form.designation}
                      onChange={handleChange}
                    />
                    <Input
                      label="Company"
                      name="company"
                      value={form.company}
                      onChange={handleChange}
                    />
                    <Input
                      label="Profile Image URL"
                      name="profileUrl"
                      value={form.profileUrl}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="space-y-4">
                    <label className="block text-[11px] font-black text-slate-400 uppercase ml-1">
                      About
                    </label>
                    <textarea
                      name="bio"
                      value={form.bio}
                      onChange={handleChange}
                      rows={4}
                      className="w-full rounded-2xl border border-slate-200 p-4 focus:ring-2 focus:ring-blue-500 outline-none"
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input
                      label="Phone"
                      name="phone"
                      value={form.phone}
                      onChange={handleChange}
                    />
                    <Input
                      label="Email"
                      name="email"
                      value={form.email}
                      onChange={handleChange}
                    />
                    <Input
                      label="Website"
                      name="website"
                      value={form.website}
                      onChange={handleChange}
                    />
                  </div>
                </div>
              ) : (
                // --- DESIGN TAB ---
                <div className="space-y-10 animate-in fade-in duration-300">
                  {/* 1. Layout Selection */}
                  <div className="space-y-4">
                    <label className="block text-[11px] font-black text-slate-400 uppercase ml-1">
                      Choose Layout
                    </label>
                    <div className="grid grid-cols-3 gap-3">
                      {["minimal", "modern", "creative"].map((layoutName) => (
                        <button
                          key={layoutName}
                          onClick={() =>
                            setForm({ ...form, layout: layoutName })
                          }
                          className={`relative p-4 rounded-2xl border-2 transition-all flex flex-col items-center gap-2 group ${
                            form.layout === layoutName
                              ? "border-blue-600 bg-blue-50/50"
                              : "border-slate-100 hover:border-blue-200 bg-white"
                          }`}
                        >
                          {/* Visual Representation of Layouts */}
                          <div className="w-full aspect-[4/3] bg-slate-100 rounded-lg overflow-hidden relative shadow-sm group-hover:shadow-md transition-all">
                            {layoutName === "minimal" && (
                              <div className="absolute inset-0 flex flex-col items-center justify-center gap-1 opacity-50">
                                <div className="w-8 h-8 rounded-full bg-slate-400"></div>
                                <div className="w-16 h-2 bg-slate-300 rounded-full"></div>
                              </div>
                            )}
                            {layoutName === "modern" && (
                              <div className="absolute inset-0 flex flex-col p-3 gap-2 opacity-50">
                                <div className="w-full h-8 bg-slate-300 rounded-t-lg mb-[-10px]"></div>
                                <div className="w-8 h-8 rounded-lg bg-slate-400 border-2 border-white z-10 ml-2"></div>
                              </div>
                            )}
                            {layoutName === "creative" && (
                              <div className="absolute inset-0 flex items-center justify-center opacity-50">
                                <div className="w-full h-full bg-slate-200 flex items-center justify-center">
                                  <div className="w-10 h-10 rounded-full border-4 border-white bg-slate-400 shadow-sm"></div>
                                </div>
                              </div>
                            )}
                          </div>
                          <span className="text-xs font-bold capitalize text-slate-600">
                            {layoutName}
                          </span>
                          {form.layout === layoutName && (
                            <div className="absolute top-2 right-2 w-3 h-3 bg-blue-600 rounded-full"></div>
                          )}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* 2. Banner Settings */}
                  <div className="space-y-4">
                    <label className="block text-[11px] font-black text-slate-400 uppercase ml-1">
                      Banner Style
                    </label>
                    <div className="p-1 bg-slate-100 rounded-xl inline-flex mb-2">
                      <button
                        onClick={() =>
                          setForm({
                            ...form,
                            banner: { ...form.banner, type: "color" },
                          })
                        }
                        className={`px-4 py-2 text-xs font-bold rounded-lg transition-all ${
                          form.banner.type === "color"
                            ? "bg-white shadow-sm text-slate-800"
                            : "text-slate-500"
                        }`}
                      >
                        Solid Color
                      </button>
                      <button
                        onClick={() =>
                          setForm({
                            ...form,
                            banner: { ...form.banner, type: "image" },
                          })
                        }
                        className={`px-4 py-2 text-xs font-bold rounded-lg transition-all ${
                          form.banner.type === "image"
                            ? "bg-white shadow-sm text-slate-800"
                            : "text-slate-500"
                        }`}
                      >
                        Image URL
                      </button>
                    </div>

                    {form.banner.type === "color" ? (
                      <div className="flex items-center gap-3">
                        <input
                          type="color"
                          value={form.banner.value || "#2563eb"}
                          onChange={(e) =>
                            setForm({
                              ...form,
                              banner: {
                                type: "color",
                                value: e.target.value,
                              },
                            })
                          }
                          className="w-12 h-12 rounded-xl cursor-pointer border-0 p-0 overflow-hidden"
                        />
                        <input
                          type="text"
                          value={form.banner.value}
                          onChange={(e) =>
                            setForm({
                              ...form,
                              banner: {
                                type: "color",
                                value: e.target.value,
                              },
                            })
                          }
                          placeholder="#000000"
                          className="flex-1 px-4 py-3 rounded-xl border border-slate-200 text-sm font-mono"
                        />
                      </div>
                    ) : (
                      <Input
                        label="Banner Image URL"
                        placeholder="https://..."
                        value={form.banner.value}
                        onChange={(e) =>
                          setForm({
                            ...form,
                            banner: {
                              type: "image",
                              value: e.target.value,
                            },
                          })
                        }
                      />
                    )}
                  </div>

                  {/* 3. Typography */}
                  <div className="space-y-4">
                    <label className="block text-[11px] font-black text-slate-400 uppercase ml-1">
                      Typography
                    </label>
                    <div className="grid grid-cols-3 gap-3">
                      {[
                        { id: "basic", label: "Basic", class: "font-sans" },
                        { id: "serif", label: "Serif", class: "font-serif" },
                        { id: "mono", label: "Mono", class: "font-mono" },
                      ].map((font) => (
                        <button
                          key={font.id}
                          onClick={() =>
                            setForm({ ...form, fontStyle: font.id })
                          }
                          className={`py-3 px-4 rounded-xl border transition-all text-sm ${
                            font.class
                          } ${
                            form.fontStyle === font.id
                              ? "border-blue-600 bg-blue-50 text-blue-700 font-bold"
                              : "border-slate-200 text-slate-600 hover:border-slate-300"
                          }`}
                        >
                          Aa {font.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* 4. Card Skin (Background) */}
                  <div className="space-y-4">
                    <label className="block text-[11px] font-black text-slate-400 uppercase ml-1">
                      Page Background (Skin)
                    </label>
                    <Input
                      label="Background Color or Image URL"
                      placeholder="#F3F4F6 or https://..."
                      value={form.cardSkin || ""}
                      onChange={(e) =>
                        setForm({ ...form, cardSkin: e.target.value })
                      }
                    />
                    <p className="text-[10px] text-slate-400 ml-1">
                      Paste a HEX color code (e.g. #ffffff) or a direct image
                      link.
                    </p>
                  </div>

                  {/* Danger Zone */}
                  <div className="pt-10 border-t border-slate-100 mt-8">
                    <div className="flex items-center gap-2 text-red-600 font-bold mb-2">
                      <Trash2 size={18} /> Danger Zone
                    </div>
                    <p className="text-sm text-slate-400 mb-4">
                      Once you delete a card, there is no going back. Please be
                      certain.
                    </p>
                    <button
                      onClick={() => setShowDeleteConfirm(true)}
                      className="text-red-600 font-bold text-sm hover:underline"
                    >
                      Permanently delete this card
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Live Preview */}
        <div className="w-full lg:w-2/5 flex flex-col items-center">
          <div className="sticky top-28 flex flex-col items-center">
            <CardPreview data={form} />
          </div>
        </div>
      </main>
    </div>
  );
}

function Input({ label, ...props }) {
  return (
    <div className="space-y-1">
      <label className="block text-[11px] font-black text-slate-500 ml-1 uppercase">
        {label}
      </label>
      <input
        {...props}
        className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-slate-700 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
      />
    </div>
  );
}
