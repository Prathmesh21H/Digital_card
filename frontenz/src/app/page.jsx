"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { onAuthStateChanged } from "firebase/auth";
import { collection, query, where, getDocs } from "firebase/firestore"; // Import Firestore methods
import { auth, db } from "@/lib/firebase"; // Ensure 'db' is exported from your firebase config

import Footer from "@/components/Footer";
import AuthModal from "@/components/AuthModal";
import Navigation from "@/components/Navigation";
import Hero from "@/components/Hero";
import Features from "@/components/Features";
import LiveDemo from "@/components/LiveDemo";

const App = () => {
  const router = useRouter();

  const [isScrolled, setIsScrolled] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [authView, setAuthView] = useState("login");
  const [checkingAuth, setCheckingAuth] = useState(true);

  // 🔐 AUTH & REDIRECT LOGIC
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          // 1. Check Firestore for an existing card owned by this user
          const cardsRef = collection(db, "cards");
          const q = query(cardsRef, where("ownerUid", "==", user.uid));
          const querySnapshot = await getDocs(q);

          if (!querySnapshot.empty) {
            // 2. If card exists, get the cardLink (slug) and redirect
            const cardData = querySnapshot.docs[0].data();
            const cardLink = cardData.cardLink;
            router.replace(`/p/${cardLink}`);
          } else {
            // 3. If no card exists, redirect to creation page
            router.replace("/create");
          }
        } catch (error) {
          console.error("Error checking for existing card:", error);
          router.replace("/create"); // Fallback to create on error
        }
      } else {
        setCheckingAuth(false);
      }
    });

    return () => unsubscribe();
  }, [router]);

  // 📜 SCROLL LOGIC
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const openAuth = (view) => {
    setAuthView(view);
    setIsAuthOpen(true);
  };

  if (checkingAuth) {
    return (
      <div className="h-screen flex items-center justify-center bg-white">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-slate-500 text-sm font-medium">Verifying account...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="font-sans antialiased bg-white text-slate-900 selection:bg-blue-100 selection:text-blue-700">
      <Navigation isScrolled={isScrolled} onOpenAuth={openAuth} />
      <main>
        <Hero onOpenAuth={openAuth} />
        <Features />
        <LiveDemo onOpenAuth={openAuth} />
      </main>
      <Footer />

      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        initialView={authView}
      />
    </div>
  );
};

export default App;