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

  const cardLinkString = useMemo(() => {
    if (!rawSlug) return null;

    if (Array.isArray(rawSlug)) {
      const idx = rawSlug.indexOf("card");
      return idx !== -1 ? rawSlug.slice(idx).join("/") : rawSlug.join("/");
    }

    return rawSlug.startsWith("card/") ? rawSlug : null;
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
    if (!cardLinkString) return;

    (async () => {
      try {
        setLoading(true);
        const res = await axios.get(
          `${API_BASE_URL}api/cards/public/${cardLinkString}`
        );
        setCard(res.data.card);
      } catch {
        setError(true);
      } finally {
        setLoading(false);
      }
    })();
  }, [cardLinkString]);

  /* ---------- AUTH ---------- */

  useEffect(() => {
    return onAuthStateChanged(auth, (user) => {
      setIsOwner(user && card && user.uid === card.ownerUid);
    });
  }, [card]);

  /* ---------- WALLET ---------- */

  const saveToWallet = useCallback(
    async (user) => {
      try {
        setSavingWallet(true);
        const token = await user.getIdToken(true);

        await axios.post(
          `${API_BASE_URL}api/recently-scanned`,
          { cardLink: cardLinkString },
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
    [cardLinkString]
  );

  const handleWallet = (e) => {
    e.stopPropagation();
    const user = auth.currentUser;

    if (user) saveToWallet(user);
    else {
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

  /* ---------- QR URL (🔥 FIX) ---------- */

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
      <div className="h-screen flex items-center justify-center font-bold">
        Card Not Found
      </div>
    );

  return (
    <div className="h-screen flex justify-center bg-gray-300 p-4">
      <div
        className="w-full max-w-md h-full perspective-1000"
        onClick={() => setIsFlipped(!isFlipped)}
      >
        <div
          className={`relative w-full h-full transition-transform duration-700 preserve-3d ${
            isFlipped ? "rotate-y-180" : ""
          }`}
        >
          {/* FRONT */}
          <div className="absolute inset-0 backface-hidden bg-white rounded-3xl p-6">
            <h1 className="text-2xl font-black text-center">
              {card.fullName}
            </h1>

            <div className="mt-6">
              <button
                onClick={handleWallet}
                className="w-full py-4 bg-blue-600 text-white rounded-xl font-bold flex justify-center gap-2"
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
                  onClick={() => router.push(`/edit/${card.cardId}`)}
                  className="px-4 py-2 bg-gray-100 rounded-full"
                >
                  <Pencil size={14} />
                </button>
                <button
                  onClick={() => setDeleteOpen(true)}
                  className="px-4 py-2 bg-red-100 rounded-full"
                >
                  <Trash2 size={14} />
                </button>
                <button
                  onClick={() => router.push("/wallet")}
                  className="px-4 py-2 bg-emerald-100 rounded-full"
                >
                  <CreditCard size={14} />
                </button>
              </div>
            )}
          </div>

          {/* BACK */}
          <div className="absolute inset-0 backface-hidden rotate-y-180 bg-white rounded-3xl flex flex-col items-center justify-center">
            <QRCodeCanvas value={qrValue} size={180} level="H" />
            <p className="mt-4 text-xs text-gray-400">Tap to return</p>
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
