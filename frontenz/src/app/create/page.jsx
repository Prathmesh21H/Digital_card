"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { CardPreview } from "@/components/CardPreview";
import {
  User,
  Palette,
  ArrowRight,
  Type,
  ImageIcon,
  Upload,
  Loader2,
  X,
  Lock,
  Crown,
} from "lucide-react";
import { auth } from "@/lib/firebase";
import { cardAPI, setAuthToken, subscriptionAPI } from "@/lib/api";
import axios from "axios";

// --- CONSTANTS ---
const PLANS = {
  FREE: "FREE",
  PRO: "PRO",
};

// --- Layout Definitions ---
const layoutOptions = [
  { id: "minimal", isPro: false },
  { id: "modern", isPro: false },
  { id: "creative", isPro: false },
  { id: "corporate", isPro: true },
  { id: "glass", isPro: true },
  { id: "elegant", isPro: true },
];

// --- Skin Patterns ---
const skinPatterns = [
  { name: "None", url: "" },
  {
    name: "Abstract",
    url: "https://img.freepik.com/free-vector/white-abstract-background_23-2148810113.jpg",
  },
  {
    name: "Geometric",
    url: "https://img.freepik.com/free-vector/white-gray-geometric-pattern-background-vector_53876-136510.jpg",
  },
  {
    name: "Marble",
    url: "https://img.freepik.com/free-photo/white-marble-texture-background_23-2148825001.jpg",
  },
  {
    name: "Gradient",
    url: "https://img.freepik.com/free-vector/gradient-white-monochrome-background_23-2149001474.jpg",
  },
];

export default function CreateCardPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("content");
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [subscription, setSubscription] = useState(null);
  const [formErrors, setFormErrors] = useState({});

  const [form, setForm] = useState({
    profileUrl: "",
    banner: { type: "color", value: "#2563eb" },
    accentColor: "#2563eb",
    fontStyle: "basic",
    cardSkin: "",
    layout: "minimal",
    fullName: "",
    designation: "",
    company: "",
    bio: "",
    phone: "",
    email: "",
    website: "",
    linkedin: "",
    twitter: "",
    instagram: "",
    facebook: "",
  });

  const CLOUDINARY_UPLOAD_PRESET = "DigitalCard";
  const CLOUDINARY_CLOUD_NAME = "dmow3iq7c";

  // --- INITIAL LOAD ---
  useEffect(() => {
    const fetchSubscription = async () => {
      try {
        const user = auth.currentUser;
        if (!user) return;
        const token = await user.getIdToken();
        setAuthToken(token);

        const res = await subscriptionAPI.getCurrentSubscription();
        setSubscription(res);
      } catch (err) {
        console.error("Failed to fetch subscription:", err);
        setSubscription({ plan: PLANS.FREE });
      }
    };

    fetchSubscription();
  }, []);

  // --- LOGIC: Determine Pro Status ---
  const isPro = subscription?.plan?.toUpperCase() === PLANS.PRO;

  // ---------------- FORM HANDLERS ----------------
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setFormErrors((prev) => ({ ...prev, [name]: validateField(name, value) }));
  };

  // Reusable lock helper
  const handleLockedFeature = () => {
    if (!isPro) {
      if (confirm("This is a Pro feature. Upgrade to unlock?")) {
        router.push("/subscription");
      }
      return true; // Blocked
    }
    return false; // Allowed
  };

  const updateBanner = (type, value) => {
    if (type === "image" && handleLockedFeature()) return;
    setForm({ ...form, banner: { type, value } });
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      setError("File size exceeds 5MB. Please choose a smaller image.");
      return;
    }

    setUploading(true);
    setError("");

    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);

    try {
      const res = await axios.post(
        `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`,
        formData
      );
      const imageUrl = res.data.secure_url;
      setForm((prev) => ({ ...prev, profileUrl: imageUrl }));
    } catch (err) {
      console.error("Upload Error:", err);
      setError("Failed to upload image. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  const removeImage = () => {
    setForm((prev) => ({ ...prev, profileUrl: "" }));
  };

  // ---------------- VALIDATION ----------------
  const validateField = (name, value) => {
    switch (name) {
      case "fullName":
        if (!value.trim()) return "Full Name is required";
        if (value.trim().length < 2)
          return "Full Name must be at least 2 characters";
        break;
      case "email":
        if (!value.trim()) return "Email is required";
        if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(value))
          return "Invalid email format";
        break;
      case "phone":
        if (!value.trim()) return "Phone is required";
        if (!/^\+?[\d\s-]{7,15}$/.test(value))
          return "Phone must be a valid number";
        break;
      case "website":
        if (value && !/^https?:\/\/[^\s$.?#].[^\s]*$/i.test(value))
          return "Invalid website URL";
        break;
      case "bio":
        if (!value.trim()) return "Bio is required";
        if (value.trim().length < 10) return "Bio must be at least 10 characters";
        if (value.trim().length > 200) return "Bio must not exceed 200 characters";
        break;
      default:
        return "";
    }
    return "";
  };

  const validateForm = () => {
    const errors = {};
    Object.keys(form).forEach((key) => {
      const error = validateField(key, form[key]);
      if (error) errors[key] = error;
    });
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // ---------------- CREATE CARD ----------------
  const handleCreate = async () => {
    if (loading) return;
  
    setLoading(true);
    setError("");
  
    if (!validateForm()) {
      setLoading(false);
      return;
    }
  
    try {
      const user = auth.currentUser;
      if (!user) {
        throw new Error("You must be logged in to create a card.");
      }
  
      // Pro layout check
      const selectedLayoutObj = layoutOptions.find(
        (l) => l.id === form.layout
      );
  
      if (selectedLayoutObj?.isPro && !isPro) {
        throw new Error("You selected a Pro layout. Please upgrade to publish.");
      }
  
      // Pro banner check
      if (form.banner?.type === "image" && !isPro) {
        throw new Error("Custom banner images are a Pro feature.");
      }
  
      // Auth token
      const token = await user.getIdToken();
      setAuthToken(token);
  
      // 🔥 CREATE CARD
      const res = await cardAPI.createCard(form);
      console.log("CREATE CARD RESPONSE 👉", res);
  
      const cardLink = res?.cardLink;
  
      if (!cardLink) {
        console.error("❌ Full API response:", res);
        throw new Error("Card created but card link not returned");
      }
  
      // ✅ REDIRECT
      router.push(`/p/${cardLink}`);
  
      // OR open in new tab
      // window.open(`/${cardLink}`, "_blank");
  
    } catch (err) {
      console.error("Create Card Error:", err);
  
      if (err.response?.status === 403) {
        setError("Card limit reached. Upgrade your plan.");
      } else {
        setError(err.message || "Something went wrong.");
      }
    } finally {
      setLoading(false);
    }
  };
  
  

  const fontOptions = [
    { id: "basic", label: "Basic", class: "font-sans" },
    { id: "serif", label: "Serif", class: "font-serif" },
    { id: "mono", label: "Mono", class: "font-mono" },
    { id: "script", label: "Script", class: "font-serif italic" },
    { id: "wide", label: "Wide", class: "font-sans tracking-widest uppercase text-[10px]" },
    { id: "bold", label: "Bold", class: "font-sans font-black" },
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 py-4 px-6 sticky top-0 z-20">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-4">
            <h1 className="text-xl font-bold text-slate-900">Card Builder</h1>
             <div className={`hidden sm:flex items-center gap-1 text-xs font-bold uppercase tracking-wider px-3 py-1.5 rounded-full ${isPro ? "bg-blue-100 text-blue-700" : "bg-slate-100 text-slate-500"}`}>
                {isPro ? <Crown size={14} /> : null}
                {isPro ? "Pro Plan" : "Free Plan"}
             </div>
          </div>
          
          <button
            onClick={handleCreate}
            disabled={loading || uploading}
            className="flex items-center gap-2 bg-blue-600 text-white px-6 py-2 rounded-full font-semibold hover:bg-blue-700 transition disabled:opacity-50 shadow-md shadow-blue-200"
          >
            {loading ? "Creating..." : "Publish Card"} <ArrowRight size={18} />
          </button>
        </div>
      </header>

      <main className="flex-1 max-w-7xl mx-auto w-full p-4 lg:p-8 flex flex-col lg:flex-row gap-8">
        {/* Editor Panel */}
        <div className="w-full lg:w-3/5 space-y-6">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
            {/* Tabs */}
            <div className="flex border-b border-slate-100 bg-slate-50/50">
              <TabButton
                active={activeTab === "content"}
                onClick={() => setActiveTab("content")}
                icon={<User size={18} />}
                label="Content"
              />
              <TabButton
                active={activeTab === "design"}
                onClick={() => setActiveTab("design")}
                icon={<Palette size={18} />}
                label="Design"
              />
            </div>

            <div className="p-6 lg:p-10">
              {error && (
                <div className="mb-6 p-4 bg-red-50 text-red-600 border border-red-100 rounded-2xl text-sm flex items-center gap-2">
                  <span>{error}</span>
                </div>
              )}

              {activeTab === "content" ? (
                <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-500">
                  <FormSection title="Identity">
                    {/* ... (Identity Fields Same as before) ... */}
                    <div className="col-span-1 md:col-span-2 mb-4">
                      <label className="block text-[11px] font-bold text-slate-500 ml-1 uppercase mb-2">
                        Profile Photo
                      </label>
                      <div className="flex items-start gap-6">
                        <div className="relative group shrink-0">
                          <div className="w-24 h-24 rounded-2xl bg-slate-100 border-2 border-slate-200 overflow-hidden flex items-center justify-center">
                            {form.profileUrl ? (
                              <img
                                src={form.profileUrl}
                                alt="Profile"
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <User className="text-slate-300" size={40} />
                            )}
                          </div>
                          {form.profileUrl && (
                            <button
                              onClick={removeImage}
                              className="absolute -top-2 -right-2 bg-red-500 text-white p-1 rounded-full shadow-sm hover:bg-red-600 transition-colors"
                            >
                              <X size={12} />
                            </button>
                          )}
                        </div>
                        <div className="flex-1">
                          <label className="flex flex-col items-center justify-center w-full h-24 border-2 border-dashed border-slate-300 rounded-2xl cursor-pointer bg-slate-50 hover:bg-slate-100 transition-colors group relative">
                            {uploading ? (
                              <div className="flex flex-col items-center text-slate-400">
                                <Loader2 className="animate-spin mb-2" size={24} />
                                <span className="text-xs font-medium">Uploading...</span>
                              </div>
                            ) : (
                              <div className="flex flex-col items-center text-slate-400 group-hover:text-blue-600">
                                <Upload className="mb-2" size={24} />
                                <span className="text-xs font-semibold">Click to upload image</span>
                              </div>
                            )}
                            <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} disabled={uploading} />
                          </label>
                        </div>
                      </div>
                    </div>

                    <Input label="Full Name" name="fullName" value={form.fullName} onChange={handleChange} error={formErrors.fullName} />
                    <Input label="Designation" name="designation" value={form.designation} onChange={handleChange} />
                    <Input label="Company" name="company" value={form.company} onChange={handleChange} />
                    <Input label="Bio" name="bio" value={form.bio} onChange={handleChange} error={formErrors.bio} />
                  </FormSection>

                  <FormSection title="Contact Info">
                    <Input label="Email" name="email" value={form.email} onChange={handleChange} error={formErrors.email} />
                    <Input label="Phone" name="phone" value={form.phone} onChange={handleChange} error={formErrors.phone} />
                    <Input label="Website" name="website" value={form.website} onChange={handleChange} error={formErrors.website} />
                  </FormSection>

                  <FormSection title="Social Media">
                    <Input label="LinkedIn URL" name="linkedin" value={form.linkedin} onChange={handleChange} />
                    <Input label="Twitter (X) URL" name="twitter" value={form.twitter} onChange={handleChange} />
                    <Input label="Instagram URL" name="instagram" value={form.instagram} onChange={handleChange} />
                    <Input label="Facebook URL" name="facebook" value={form.facebook} onChange={handleChange} />
                  </FormSection>
                </div>
              ) : (
                <DesignTab
                  form={form}
                  setForm={setForm}
                  fontOptions={fontOptions}
                  updateBanner={updateBanner}
                  isPro={isPro}
                  handleLockedFeature={handleLockedFeature}
                />
              )}
            </div>
          </div>
        </div>

        {/* Live Preview */}
        <div className="w-full lg:w-2/5">
          <div className="sticky top-28 flex flex-col items-center">
            <div className="mb-6 flex items-center gap-2 px-4 py-1.5 bg-green-100 text-green-700 rounded-full text-xs font-bold uppercase tracking-widest">
              <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>{" "}
              Live Preview
            </div>
            <div className="relative group">
              <div className="absolute -inset-4 border-[10px] border-slate-900 rounded-[3.5rem] pointer-events-none shadow-2xl z-10"></div>
              <div className="relative z-0 overflow-hidden rounded-[2.5rem]">
                <CardPreview data={form} />
              </div>
            </div>
            <p className="mt-8 text-slate-400 text-sm italic text-center max-w-[280px]">
              This is how your digital card will appear to others when shared.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}

// ---------------- SUB-COMPONENTS ----------------
function TabButton({ active, onClick, icon, label }) {
  return (
    <button
      onClick={onClick}
      className={`flex-1 flex items-center justify-center gap-2 py-5 text-sm font-bold transition-all border-b-2 ${
        active
          ? "border-blue-600 text-blue-600 bg-white"
          : "border-transparent text-slate-400 hover:text-slate-600"
      }`}
    >
      {icon} {label}
    </button>
  );
}

function FormSection({ title, children }) {
  return (
    <div>
      <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">
        {title}
      </label>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">{children}</div>
    </div>
  );
}

function Input({ label, error, ...props }) {
  return (
    <div className="space-y-1">
      {label && (
        <label className="block text-[11px] font-bold text-slate-500 ml-1">
          {label}
        </label>
      )}
      <input
        {...props}
        className={`w-full rounded-xl border px-4 py-3 text-slate-700 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all placeholder:text-slate-300 ${
          error ? "border-red-500" : "border-slate-200"
        } ${props.disabled ? "bg-slate-50 cursor-not-allowed" : ""}`}
      />
      {error && <p className="text-red-500 text-xs ml-1">{error}</p>}
    </div>
  );
}

// ---------------- DESIGN TAB ----------------
function SectionHeading({ icon, title }) {
  return (
    <div className="flex items-center gap-2 text-slate-700 font-bold text-sm mb-2">
      {icon}
      <span>{title}</span>
    </div>
  );
}

function DesignTab({ form, setForm, fontOptions, updateBanner, isPro, handleLockedFeature }) {
  
  const handleLayoutSelect = (layoutId, layoutIsPro) => {
    if (layoutIsPro && handleLockedFeature()) return;
    setForm({ ...form, layout: layoutId });
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-2 duration-500">
      {/* Layout Section */}
      <div>
        <div className="flex justify-between items-center mb-4">
          <SectionHeading icon={<Type size={18} />} title="Choose Layout" />
          {!isPro && (
            <span className="text-[10px] bg-amber-100 text-amber-700 font-bold px-2 py-1 rounded-full uppercase tracking-wider flex items-center gap-1">
              <Crown size={12} /> Go Pro to Unlock All
            </span>
          )}
        </div>
        <div className="grid grid-cols-3 gap-3 mt-4">
          {layoutOptions.map((layout) => {
            const isLocked = layout.isPro && !isPro;
            return (
              <button
                key={layout.id}
                onClick={() => handleLayoutSelect(layout.id, layout.isPro)}
                className={`relative p-3 rounded-2xl border-2 transition-all flex flex-col items-center gap-2 group cursor-pointer ${
                  form.layout === layout.id
                    ? "border-blue-600 bg-blue-50/50"
                    : "border-slate-100 bg-white"
                } ${
                  isLocked
                    ? "hover:ring-2 hover:ring-amber-400 hover:border-amber-400"
                    : "hover:border-blue-200"
                }`}
              >
                {isLocked && (
                  <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-slate-50/60 backdrop-blur-[1px] rounded-2xl transition-opacity group-hover:bg-slate-50/40">
                    <div className="bg-slate-900 text-white p-2 rounded-full shadow-lg group-hover:bg-amber-500 transition-colors">
                      <Lock size={16} />
                    </div>
                    <span className="text-[10px] font-bold text-slate-900 mt-1 bg-white/80 px-2 rounded-full">Pro</span>
                  </div>
                )}
                {/* --- LAYOUT VISUAL PREVIEWS (CSS SHAPES) --- */}
                <div className="w-full aspect-[4/3] bg-slate-100 rounded-lg overflow-hidden relative shadow-sm border border-slate-200/50">
                  {layout.id === "minimal" && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center gap-1 opacity-50">
                      <div className="w-8 h-8 rounded-full bg-slate-400"></div>
                      <div className="w-12 h-1.5 bg-slate-300 rounded-full"></div>
                    </div>
                  )}
                  {layout.id === "modern" && <div className="absolute inset-0 flex flex-col p-2 gap-2 opacity-50"><div className="w-full h-6 bg-slate-300 rounded-t-lg mb-[-10px]"></div><div className="w-8 h-8 rounded-lg bg-slate-400 border-2 border-white z-10 ml-1"></div></div>}
                  {layout.id === "creative" && <div className="absolute inset-0 flex items-center justify-center opacity-50"><div className="w-full h-full bg-slate-200 flex items-center justify-center"><div className="w-10 h-10 rounded-full border-4 border-white bg-slate-400 shadow-sm"></div></div></div>}
                  {layout.id === "corporate" && <div className="absolute inset-0 flex opacity-60"><div className="w-1/3 h-full bg-slate-600 flex flex-col items-center pt-2 gap-1"><div className="w-5 h-5 rounded-full bg-white/50"></div></div><div className="w-2/3 bg-white"></div></div>}
                  {layout.id === "glass" && <div className="absolute inset-0 flex items-center justify-center opacity-60 bg-gradient-to-br from-blue-200 to-purple-200"><div className="w-16 h-10 bg-white/50 backdrop-blur-sm rounded border border-white/60"></div></div>}
                  {layout.id === "elegant" && <div className="absolute inset-0 p-2 flex flex-col items-center justify-center opacity-50"><div className="w-full h-full border border-slate-500 flex items-center justify-center"><div className="w-6 h-6 rotate-45 border border-slate-500"></div></div></div>}
                </div>
                <span className="text-xs font-bold capitalize text-slate-600">{layout.id}</span>
                {form.layout === layout.id && (
                  <div className="absolute top-2 right-2 w-2.5 h-2.5 bg-blue-600 rounded-full"></div>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Banner Colors */}
      <div>
        <SectionHeading icon={<Palette size={18} />} title="Banner & Brand" />
        <div className="flex gap-2 mt-4 mb-4">
          <button
            onClick={() => updateBanner("color", "#2563eb")}
            className={`px-4 py-2 text-xs font-bold rounded-lg border ${
              form.banner.type === "color" ? "bg-slate-800 text-white border-slate-800" : "bg-white border-slate-200 text-slate-600"
            }`}
          >
            Color
          </button>
          <button
            onClick={() => updateBanner("image", "")}
            className={`relative px-4 py-2 text-xs font-bold rounded-lg border flex items-center gap-2 ${
              form.banner.type === "image" ? "bg-slate-800 text-white border-slate-800" : "bg-white border-slate-200 text-slate-600"
            } ${!isPro ? "opacity-70" : ""}`}
          >
            Image {!isPro && <Lock size={12} className="text-amber-600" />}
          </button>
        </div>

        {form.banner.type === "color" ? (
          <div className="flex flex-wrap gap-3">
            {["#2563eb", "#7C3AED", "#DB2777", "#059669", "#DC2626", "#0F172A", "#F59E0B"].map((color) => (
              <button
                key={color}
                onClick={() => updateBanner("color", color)}
                className={`w-10 h-10 rounded-full border-4 transition-transform hover:scale-110 ${
                  form.banner.value === color ? "border-white ring-2 ring-blue-500 scale-110" : "border-transparent"
                }`}
                style={{ backgroundColor: color }}
              />
            ))}
          </div>
        ) : (
          <Input label="Banner Image URL" name="bannerValue" value={form.banner.value} onChange={(e) => updateBanner("image", e.target.value)} placeholder="https://..." disabled={!isPro} />
        )}

        {/* Accent Color */}
        {/* <div className="mt-6 relative">
             <div className="flex justify-between items-center mb-2">
                <label className="text-[11px] font-bold text-slate-500 ml-1">ACCENT COLOR</label>
                {!isPro && <span className="text-[10px] font-bold bg-amber-100 text-amber-700 px-2 rounded-full flex items-center gap-1"><Crown size={10} /> PRO</span>}
             </div>
             <div className="flex items-center gap-3" onClickCapture={() => !isPro && handleLockedFeature()}>
                 <div className="relative">
                    <input type="color" value={form.accentColor} onChange={(e) => setForm({...form, accentColor: e.target.value})} disabled={!isPro} className={`w-12 h-12 rounded-xl cursor-pointer border-0 p-0 overflow-hidden ${!isPro ? "opacity-50" : ""}`} />
                 </div>
                 <input type="text" value={form.accentColor} onChange={(e) => setForm({...form, accentColor: e.target.value})} disabled={!isPro} className={`flex-1 rounded-2xl border border-slate-200 px-4 py-3 text-slate-700 focus:ring-2 focus:ring-blue-500 outline-none uppercase ${!isPro ? "bg-slate-50 text-slate-400 cursor-not-allowed" : ""}`} />
             </div>
        </div> */}
      </div>

      {/* Font Selection */}
      <div>
        <SectionHeading icon={<Type size={18} />} title="Typography" />
        <div className="grid grid-cols-3 gap-2 mt-2">
          {fontOptions.map((f) => (
            <button
              key={f.id}
              onClick={() => setForm({ ...form, fontStyle: f.id })}
              className={`flex items-center justify-center py-3 rounded-lg border text-sm capitalize transition-all ${
                form.fontStyle === f.id ? "bg-slate-900 text-white border-slate-900 shadow-md" : "bg-white text-slate-600 border-slate-200 hover:border-slate-300"
              } ${f.class}`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* Card Skin Section (VISUAL GRID) */}
      <div>
        <div className="flex justify-between items-center mb-4">
           <SectionHeading icon={<ImageIcon size={18} />} title="Page Background" />
           {!isPro && <span className="text-[10px] font-bold bg-amber-100 text-amber-700 px-2 rounded-full flex items-center gap-1"><Crown size={10} /> PRO</span>}
        </div>
        
        <div className="space-y-4">
           {/* Visual Skin Patterns */}
           <div 
             className="grid grid-cols-3 sm:grid-cols-4 gap-3"
             onClickCapture={() => !isPro && handleLockedFeature()} 
           >
              {skinPatterns.map((skin, idx) => {
                const isActive = form.cardSkin === skin.url || (!form.cardSkin && !skin.url);
                return (
                  <div
                    key={idx}
                    onClick={() => setForm({ ...form, cardSkin: skin.url })}
                    className={`aspect-square rounded-xl border-2 cursor-pointer overflow-hidden relative transition-all group ${
                      isActive
                        ? "border-blue-600 ring-2 ring-blue-100 scale-105"
                        : "border-slate-200 hover:border-slate-300"
                    } ${!isPro ? "opacity-60" : ""}`}
                  >
                    {skin.url ? (
                      <img src={skin.url} alt={skin.name} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full bg-slate-50 flex items-center justify-center text-slate-400 text-xs font-medium">None</div>
                    )}
                    
                    <div className="absolute bottom-0 left-0 w-full bg-black/60 p-1 text-center backdrop-blur-sm">
                      <span className="text-[10px] text-white font-medium uppercase tracking-wide">{skin.name}</span>
                    </div>

                    {!isPro && (
                      <div className="absolute inset-0 flex items-center justify-center z-10">
                        <div className="bg-slate-900/80 p-1.5 rounded-full text-white shadow-sm"><Lock size={12} /></div>
                      </div>
                    )}
                  </div>
                );
              })}
           </div>

           {/* Custom URL Input */}
           <div onClickCapture={() => !isPro && handleLockedFeature()}>
              <label className="text-[10px] font-bold text-slate-400 uppercase mb-1 block">Or use custom URL / Hex Color</label>
              <Input
                name="cardSkin"
                value={form.cardSkin || ""}
                onChange={(e) => setForm({ ...form, cardSkin: e.target.value })}
                placeholder="#F3F4F6 or https://..."
                disabled={!isPro}
                className={!isPro ? "bg-slate-50 cursor-not-allowed" : ""}
              />
           </div>
        </div>
      </div>
    </div>
  );
}