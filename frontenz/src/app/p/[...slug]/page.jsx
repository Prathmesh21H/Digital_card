"use client";

import React, { useEffect, useState, useCallback, useMemo } from "react";
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
  CreditCard,
} from "lucide-react";
import { QRCodeCanvas } from "qrcode.react";

import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/lib/firebase";
import AuthModal from "@/components/AuthModal";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/";

/* ---------------- DELETE MODAL ---------------- */

const DeleteModal = ({ isOpen, onClose, onConfirm, isDeleting }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60">
      <div
        className="bg-white rounded-2xl p-6 w-full max-w-sm"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-center mb-4 text-red-600">
          <AlertTriangle size={32} />
        </div>
        <h3 className="text-lg font-bold text-center">Delete Card?</h3>
        <p className="text-sm text-gray-500 text-center mt-2">
          This action cannot be undone.
        </p>

        <div className="flex gap-3 mt-6">
          <button
            onClick={onClose}
            className="flex-1 py-2 bg-gray-100 rounded-xl font-bold"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={isDeleting}
            className="flex-1 py-2 bg-red-600 text-white rounded-xl font-bold flex justify-center items-center gap-2"
          >
            {isDeleting ? (
              <>
                <Loader2 size={16} className="animate-spin" /> Deleting
              </>
            ) : (
              "Delete"
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

/* ---------------- PAGE ---------------- */

export default function PublicCardPage() {
  const params = useParams();
  const router = useRouter();
  const rawSlug = params?.slug;

  /**
   * FIX: Simplified slug logic. 
   * If the URL is /card/123, rawSlug is "123".
   * We ensure the API call always uses the format "card/{id}"
   */
  const cardId = useMemo(() => {
    if (!rawSlug) return null;
    if (Array.isArray(rawSlug)) return rawSlug[rawSlug.length - 1];
    return rawSlug;
  }, [rawSlug]);

  const [card, setCard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const [savingWallet, setSavingWallet] = useState(false);
  const [isFlipped, setIsFlipped] = useState(false);
  const [isOwner, setIsOwner] = useState(false);

  const [authOpen, setAuthOpen] = useState(false);
  const [pendingSave, setPendingSave] = useState(false);

  const [deleteOpen, setDeleteOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  /* ---------- FETCH CARD ---------- */

  useEffect(() => {
    if (!cardId) return;

    const fetchCard = async () => {
      try {
        setLoading(true);
        // Ensure we prepend 'card/' if the backend endpoint expects api/cards/public/card/{id}
        const endpoint = cardId.startsWith("card/") ? cardId : `card/${cardId}`;
        
        const res = await axios.get(
          `${API_BASE_URL}api/cards/public/${endpoint}`
        );
        setCard(res.data.card);
        setError(false);
      } catch (err) {
        console.error("Fetch Error:", err);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchCard();
  }, [cardId]);

  /* ---------- AUTH ---------- */

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setIsOwner(!!(user && card && user.uid === card.ownerUid));
    });
    return () => unsubscribe();
  }, [card]);

  /* ---------- WALLET ---------- */

  const saveToWallet = useCallback(
    async (user) => {
      try {
        setSavingWallet(true);
        const token = await user.getIdToken(true);
        const cardLinkPath = cardId.startsWith("card/") ? cardId : `card/${cardId}`;

        await axios.post(
          `${API_BASE_URL}api/recently-scanned`,
          { cardLink: cardLinkPath },
          { headers: { Authorization: `Bearer ${token}` } }
        );

        alert("Saved to wallet");
      } catch (e) {
        alert("Failed to save");
      } finally {
        setSavingWallet(false);
        setPendingSave(false);
      }
    },
    [cardId]
  );

  const handleWallet = (e) => {
    e.stopPropagation();
    const user = auth.currentUser;

    if (user) {
      saveToWallet(user);
    } else {
      setPendingSave(true);
      setAuthOpen(true);
    }
  };

  /* ---------- DELETE ---------- */

  const confirmDelete = async () => {
    try {
      setIsDeleting(true);
      const token = await auth.currentUser.getIdToken();
      await axios.delete(`${API_BASE_URL}api/cards/${card.cardId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      router.push("/create");
    } catch {
      setIsDeleting(false);
      setDeleteOpen(false);
    }
  };

  /* ---------- QR URL ---------- */

  const qrValue =
    typeof window !== "undefined" && card
      ? `${window.location.origin}/card/${card.cardId}`
      : "";

  /* ---------- UI ---------- */

  if (loading)
    return (
      <div className="h-screen flex items-center justify-center">
        <Loader2 size={40} className="animate-spin text-blue-600" />
      </div>
    );

  if (error)
    return (
      <div className="h-screen flex flex-col items-center justify-center gap-4">
        <h2 className="text-xl font-bold">Card Not Found</h2>
        <button 
          onClick={() => window.location.reload()} 
          className="px-4 py-2 bg-blue-600 text-white rounded-lg flex items-center gap-2"
        >
          <RefreshCw size={16} /> Retry
        </button>
      </div>
    );

  return (
    <div className="h-screen flex justify-center bg-gray-300 p-4">
      <div
        className="w-full max-w-md h-full perspective-1000"
        onClick={() => setIsFlipped(!isFlipped)}
      >
        <div
          className={`relative w-full h-full transition-transform duration-700 preserve-3d cursor-pointer ${
            isFlipped ? "rotate-y-180" : ""
          }`}
        >
          {/* FRONT */}
          <div className="absolute inset-0 backface-hidden bg-white rounded-3xl p-6 shadow-xl">
            <div className="flex flex-col items-center">
              <div className="w-24 h-24 bg-gray-200 rounded-full mb-4 flex items-center justify-center">
                <Building2 size={40} className="text-gray-400" />
              </div>
              <h1 className="text-2xl font-black text-center">
                {card?.fullName || "No Name"}
              </h1>
              <p className="text-gray-500">{card?.jobTitle}</p>
            </div>

            <div className="mt-8 space-y-3">
              <button
                onClick={handleWallet}
                className="w-full py-4 bg-blue-600 text-white rounded-xl font-bold flex justify-center items-center gap-2 hover:bg-blue-700 transition-colors"
              >
                {savingWallet ? (
                  <Loader2 size={18} className="animate-spin" />
                ) : (
                  <>
                    <Wallet size={18} /> ADD TO WALLET
                  </>
                )}
              </button>
            </div>

            {isOwner && (
              <div className="flex justify-center gap-3 mt-6">
                <button
                  onClick={(e) => { e.stopPropagation(); router.push(`/edit/${card.cardId}`); }}
                  className="p-3 bg-gray-100 rounded-full hover:bg-gray-200"
                >
                  <Pencil size={18} />
                </button>
                <button
                  onClick={(e) => { e.stopPropagation(); setDeleteOpen(true); }}
                  className="p-3 bg-red-100 text-red-600 rounded-full hover:bg-red-200"
                >
                  <Trash2 size={18} />
                </button>
                <button
                  onClick={(e) => { e.stopPropagation(); router.push("/wallet"); }}
                  className="p-3 bg-emerald-100 text-emerald-600 rounded-full hover:bg-emerald-200"
                >
                  <CreditCard size={18} />
                </button>
              </div>
            )}
            
            <p className="mt-auto pt-10 text-center text-xs text-gray-400">
              Tap card to view QR Code
            </p>
          </div>

          {/* BACK */}
          <div className="absolute inset-0 backface-hidden rotate-y-180 bg-white rounded-3xl flex flex-col items-center justify-center shadow-xl">
            <div className="p-4 bg-white rounded-2xl shadow-inner">
              <QRCodeCanvas value={qrValue} size={200} level="H" />
            </div>
            <p className="mt-6 font-bold text-gray-700">Scan to share profile</p>
            <p className="mt-2 text-xs text-gray-400">Tap to return</p>
          </div>
        </div>
      </div>

      <DeleteModal
        isOpen={deleteOpen}
        onClose={() => setDeleteOpen(false)}
        onConfirm={confirmDelete}
        isDeleting={isDeleting}
      />

      <AuthModal
        isOpen={authOpen}
        onClose={() => setAuthOpen(false)}
      />

      <style jsx global>{`
        .perspective-1000 {
          perspective: 1000px;
        }
        .preserve-3d {
          transform-style: preserve-3d;
        }
        .backface-hidden {
          backface-visibility: hidden;
        }
        .rotate-y-180 {
          transform: rotateY(180deg);
        }
      `}</style>
    </div>
  );
}
