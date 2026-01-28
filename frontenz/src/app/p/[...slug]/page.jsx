"use client";

import React, { useEffect, useState, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import axios from "axios";
import {
  Phone,
  Mail,
  Globe,
  Linkedin,
  Twitter,
  Instagram,
  Facebook,
  Loader2,
  Wallet,
  RefreshCw,
  Building2,
  Pencil,
  Trash2,
  AlertTriangle,
} from "lucide-react";
import { QRCodeCanvas } from "qrcode.react";

import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/lib/firebase";
import AuthModal from "@/components/AuthModal";

const API_BASE_URL =
  (typeof process !== "undefined" &&
    process.env &&
    process.env.NEXT_PUBLIC_API_URL) ||
  "http://localhost:5000/";

// --- DELETE MODAL COMPONENT ---
const DeleteModal = ({ isOpen, onClose, onConfirm, isDeleting }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm" onClick={(e) => e.stopPropagation()}>
      <div className="bg-white rounded-2xl w-full max-w-sm p-6 shadow-2xl animate-in fade-in zoom-in-95 duration-200" onClick={(e) => e.stopPropagation()}>
        <div className="bg-red-50 w-12 h-12 rounded-full flex items-center justify-center mb-4 text-red-600 mx-auto">
          <AlertTriangle size={24} />
        </div>
        <h3 className="text-xl font-bold text-gray-900 text-center mb-2">Delete Card?</h3>
        <p className="text-gray-500 text-center text-sm mb-6">This action cannot be undone. This card will be permanently removed.</p>
        <div className="flex gap-3">
          <button onClick={onClose} disabled={isDeleting} className="flex-1 py-2.5 bg-gray-100 text-gray-700 rounded-xl font-bold hover:bg-gray-200 transition-colors">Cancel</button>
          <button onClick={onConfirm} disabled={isDeleting} className="flex-1 py-2.5 bg-red-600 text-white rounded-xl font-bold hover:bg-red-700 transition-colors flex items-center justify-center gap-2">
            {isDeleting ? <><Loader2 size={16} className="animate-spin" /> Deleting...</> : "Delete"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default function PublicCardPage() {
  const params = useParams();
  const router = useRouter();
  const rawSlug = params?.slug;
  const cardLinkString = Array.isArray(rawSlug) ? rawSlug.join("/") : rawSlug;

  const [card, setCard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [savingWallet, setSavingWallet] = useState(false);
  const [isFlipped, setIsFlipped] = useState(false);

  const [isOwner, setIsOwner] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [authView, setAuthView] = useState("signup");
  const [pendingSave, setPendingSave] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    if (!cardLinkString) return;
    const fetchCard = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${API_BASE_URL}api/cards/public/${cardLinkString}`);
        const cardData = response.data.card;
        if (!cardData) throw new Error("No data found");
        setCard({
          ...cardData,
          banner: cardData.banner || { type: "color", value: "#2563eb" },
          layout: cardData.layout || "minimal",
          fontStyle: cardData.fontStyle || "basic",
        });
      } catch (err) {
        setError(true);
      } finally {
        setLoading(false);
      }
    };
    fetchCard();
  }, [cardLinkString]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user && card) {
        setIsOwner(user.uid === card.ownerUid);
      } else {
        setIsOwner(false);
      }
    });
    return () => unsubscribe();
  }, [card]);

  const executeWalletSave = useCallback(async (userToken) => {
    try {
      setSavingWallet(true);
      const token = userToken || localStorage.getItem("token");
      await axios.post(`${API_BASE_URL}api/recently-scanned`, { cardLink: cardLinkString }, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert("Saved to wallet!");
    } catch (err) {
      alert("Failed to save.");
    } finally {
      setSavingWallet(false);
      setPendingSave(false);
    }
  }, [cardLinkString]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user && pendingSave) {
        setIsAuthOpen(false);
        const token = await user.getIdToken();
        executeWalletSave(token);
      }
    });
    return () => unsubscribe();
  }, [pendingSave, executeWalletSave]);

  const handleSaveToWallet = (e) => {
    e.stopPropagation();
    if (auth.currentUser) {
      auth.currentUser.getIdToken(true).then(executeWalletSave);
    } else {
      setPendingSave(true); setAuthView("signup"); setIsAuthOpen(true);
    }
  };

  const handleEdit = (e) => {
    e.stopPropagation();
    router.push(`/edit/${card?.cardId}`);
  };

  const handleDeleteClick = (e) => {
    e.stopPropagation();
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    try {
      setIsDeleting(true);
      const token = await auth.currentUser.getIdToken();
      await axios.delete(`${API_BASE_URL}api/cards/${card.cardId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      router.push("/create"); 
    } catch (err) {
      setIsDeleting(false);
      setIsDeleteModalOpen(false);
    }
  };

  const { skinStyle, bannerStyle } = (function getStyles() {
    if (!card) return { skinStyle: {}, bannerStyle: {} };
    let ss = card.cardSkin?.includes("http") ? { backgroundImage: `url(${card.cardSkin})`, backgroundSize: "cover" } : { backgroundColor: card.cardSkin || "#ffffff" };
    let bs = card.banner?.type === "image" ? { backgroundImage: `url(${card.banner.value})`, backgroundSize: "cover" } : { backgroundColor: card.banner?.value || "#2563eb" };
    return { skinStyle: ss, bannerStyle: bs }; 
  })();

  if (loading) return <div className="h-screen flex items-center justify-center bg-gray-50"><Loader2 className="animate-spin text-blue-600" size={40} /></div>;
  if (error) return <div className="h-screen flex items-center justify-center font-bold">Card Not Found</div>;

  return (
    <div className="h-screen w-full flex justify-center bg-gray-300 overflow-hidden p-4">
      <div className="w-full max-w-md h-full perspective-1000 cursor-pointer" onClick={() => setIsFlipped(!isFlipped)}>
        <div className={`relative w-full h-full transition-transform duration-700 preserve-3d ${isFlipped ? "rotate-y-180" : ""}`}>
          
          {/* FRONT SIDE */}
          <div className="absolute inset-0 backface-hidden shadow-2xl rounded-[2.5rem] overflow-hidden flex flex-col" style={skinStyle}>
            <div className="relative h-32 shrink-0 w-full" style={bannerStyle}>
              <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 size-24 rounded-full shadow-2xl border-[5px] border-white bg-white overflow-hidden z-10">
                <img src={card?.profileUrl || `https://api.dicebear.com/7.x/initials/svg?seed=${card?.fullName}`} alt="Avatar" className="h-full w-full object-cover" />
              </div>
            </div>

            <div className="mt-12 px-8 text-center shrink-0">
              <h1 className="text-2xl font-black text-slate-900 truncate">{card.fullName}</h1>
              <p className="text-blue-600 font-bold text-sm uppercase tracking-widest">{card.designation}</p>
              {card.company && <p className="text-slate-500 text-xs mt-1 flex items-center justify-center gap-1 font-medium"><Building2 size={12}/> {card.company}</p>}
            </div>

            <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4 scrollbar-hide">
              <div className="grid grid-cols-1 gap-2">
                {card.phone && <StandardLink icon={<Phone size={18} />} label="Call" value={card.phone} href={`tel:${card.phone}`} color="text-blue-600" bg="bg-blue-50" />}
                {card.email && <StandardLink icon={<Mail size={18} />} label="Email" value={card.email} href={`mailto:${card.email}`} color="text-rose-600" bg="bg-rose-50" />}
                {card.website && <StandardLink icon={<Globe size={18} />} label="Website" value={card.website} href={card.website.startsWith('http') ? card.website : `https://${card.website}`} color="text-indigo-600" bg="bg-indigo-50" />}
              </div>
              <div className={layout.links}>
                {card.phone && (
                  <GlassLink
                    icon={<Phone size={20} />}
                    value={card.phone}
                    label="Phone"
                    onClick={() => window.open(`tel:${card.phone}`)}
                  />
                )}
                {card.email && (
                  <GlassLink
                    icon={<Mail size={20} />}
                    value={card.email}
                    label="Email"
                    onClick={() => window.open(`mailto:${card.email}`)}
                  />
                )}
                {card.website && (
                  <GlassLink
                    icon={<Globe size={20} />}
                    value={card.website}
                    label="Website"
                    onClick={() =>
                      window.open(
                        card.website.startsWith("http")
                          ? card.website
                          : `https://${card.website}`
                      )
                    }
                  />
                )}
                {card.linkedin && (
                  <GlassLink
                    icon={<Linkedin size={20} />}
                    value="Connect on LinkedIn"
                    label="LinkedIn"
                    onClick={() =>
                      window.open(
                        card.linkedin.startsWith("http")
                          ? card.linkedin
                          : `https://${card.linkedin}`
                      )
                    }
                  />
                )}

                <div className="pt-6 px-4 space-y-3">
                  <SaveBtn
                    onClick={handleSaveContact}
                    color="#334155"
                    glass={true}
                  />
                  <WalletBtn
                    onClick={handleSaveToWallet}
                    loading={savingWallet}
                    glass={true}
                  />
                </div>
                <SocialsRow card={card} className="justify-center mt-6" />
                <ShareQRCode textClass={textClass} />
              </div>

              {/* ADMIN ACTIONS: COMPACT & ATTRACTIVE */}
              {isOwner && (
                <div className="flex items-center justify-center gap-3 pt-4 pb-2 animate-in fade-in slide-in-from-bottom-2 duration-700">
                  <button 
                    onClick={handleEdit} 
                    className="flex items-center gap-2 px-6 py-2 bg-slate-100 text-slate-700 rounded-full text-xs font-bold shadow-sm hover:bg-slate-200 hover:text-slate-900 transition-all active:scale-95 border border-slate-200"
                  >
                    <Pencil size={14} /> Edit Card
                  </button>
                  
                  <button 
                    onClick={handleDeleteClick} 
                    className="flex items-center justify-center size-9 bg-rose-50 text-rose-500 rounded-full hover:bg-rose-100 hover:text-rose-600 transition-all active:scale-95 border border-rose-100 shadow-sm"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              )}
            </div>

            <div className="pb-4 text-center opacity-30 text-[9px] font-bold uppercase tracking-[0.3em] text-slate-900">
              <RefreshCw size={10} className="inline mr-2 animate-spin-slow" /> Tap to Flip
            </div>
          </div>

          {/* BACK SIDE */}
          <div className="absolute inset-0 backface-hidden shadow-2xl rounded-[2.5rem] overflow-hidden rotate-y-180 flex flex-col items-center justify-center p-8 bg-white">
             <div className="text-slate-900 text-center mb-8">
                <h2 className="text-2xl font-black">Scan Card</h2>
                <p className="text-sm opacity-60">Instantly view and save profile</p>
             </div>
             <div className="p-6 bg-slate-50 rounded-[2.5rem] shadow-inner border border-slate-100">
                <QRCodeCanvas value={typeof window !== "undefined" ? window.location.href : ""} size={180} level="H" includeMargin={false} />
             </div>
             <div className="mt-10 flex flex-col items-center gap-3 text-slate-400">
                <RefreshCw size={20} className="animate-bounce" />
                <p className="text-[10px] font-black tracking-widest uppercase">Tap to Return</p>
             </div>
          </div>
        </div>
      </div>

      <DeleteModal isOpen={isDeleteModalOpen} onClose={() => setIsDeleteModalOpen(false)} onConfirm={handleConfirmDelete} isDeleting={isDeleting} />
      <AuthModal isOpen={isAuthOpen} onClose={() => { setIsAuthOpen(false); setPendingSave(false); }} initialView={authView} />

      <style jsx global>{`
        .perspective-1000 { perspective: 1000px; }
        .preserve-3d { transform-style: preserve-3d; }
        .backface-hidden { backface-visibility: hidden; }
        .rotate-y-180 { transform: rotateY(180deg); }
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        .animate-spin-slow { animation: spin 6s linear infinite; }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
}

// --- SUB COMPONENTS ---

const StandardLink = ({ icon, value, href, color, bg }) => (
  <a href={href} onClick={(e) => e.stopPropagation()} target="_blank" rel="noreferrer" className="flex items-center p-3.5 bg-white/80 backdrop-blur-md border border-white rounded-2xl shadow-sm hover:shadow-md transition-all active:scale-[0.98]">
    <div className={`size-10 rounded-xl ${bg} flex items-center justify-center ${color} mr-4 shrink-0`}>{icon}</div>
    <p className="text-sm font-bold text-slate-700 truncate">{value}</p>
  </a>
);

const WalletBtn = ({ onClick, loading, themeColor }) => (
  <button 
    onClick={onClick} 
    disabled={loading} 
    className="w-full py-4 rounded-2xl text-white text-xs font-black shadow-xl flex items-center justify-center gap-3 transition-all active:scale-95 hover:brightness-110"
    style={{ backgroundColor: themeColor || '#000000' }}
  >
    {loading ? <Loader2 size={18} className="animate-spin" /> : <><Wallet size={18} /> ADD TO WALLET</>}
  </button>
);

const SocialsRow = ({ card, className = "" }) => {
  const platforms = [
    { key: "linkedin", icon: <Linkedin size={20}/>, color: "bg-[#0077b5]" },
    { key: "twitter", icon: <Twitter size={20}/>, color: "bg-black" },
    { key: "instagram", icon: <Instagram size={20}/>, color: "bg-gradient-to-tr from-[#f9ce34] via-[#ee2a7b] to-[#6228d7]" },
    { key: "facebook", icon: <Facebook size={20}/>, color: "bg-[#4267B2]" }
  ];
  if (!platforms.some(p => card[p.key])) return null;
  return (
    <div className="flex flex-col items-center mt-10 pb-6">
      {/* Perspective Container */}
      <div className="group perspective-1000">
        <div
          className={`
            p-3 rounded-xl transition-all duration-300 ease-out
            /* 1. Lift Effect: Moves up and scales slightly */
            group-hover:-translate-y-2 group-hover:scale-105
            /* 2. 3D Rotation: Slight tilt for depth */
            group-hover:rotate-x-12
            /* 3. Shadow & Background */
            ${
              isDark
                ? "bg-white/10 shadow-lg group-hover:shadow-white/20 group-hover:bg-white/15"
                : "bg-white shadow-md group-hover:shadow-xl group-hover:shadow-slate-200"
            }
          `}
        >
          <QRCodeCanvas
            value={url}
            size={90}
            bgColor="transparent"
            fgColor={isDark ? "#ffffff" : "#000000"}
            level="M"
          />
        </div>
      </div>

      <p
        className={`text-xs mt-4 transition-opacity duration-300 ${
          isDark ? "text-white/70" : "text-slate-500"
        } group-hover:opacity-100`}
      >
        Scan to open card
      </p>
    </div>
  );
};