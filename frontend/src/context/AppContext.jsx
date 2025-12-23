// src/context/AppContext.jsx
import { createContext, useContext, useMemo, useState, useEffect } from "react";
import { loadState, saveState, clearState } from "../lib/storage";

const AppContext = createContext(null);

export function AppProvider({ children }) {
  const [user, setUser] = useState(loadState("user") || null);
  const [plan, setPlan] = useState(loadState("plan") || "free");
  const [profile, setProfile] = useState(loadState("profile") || {
    fullName: "", title: "", email: "", phone: "",
    socials: { twitter: "", linkedin: "", github: "", website: "",photo: null, },
  });
  const [card, setCard] = useState(loadState("card") || {
    template: "classic",
    font: "Inter",
    colors: { primary: "#111827", accent: "#2563EB", bg: "#FFFFFF" },
    showSections: { about: true, socials: true, contact: true },

    
  });

  useEffect(() => { saveState("user", user); }, [user]);
  useEffect(() => { saveState("plan", plan); }, [plan]);
  useEffect(() => { saveState("profile", profile); }, [profile]);
  useEffect(() => { saveState("card", card); }, [card]);

  const value = useMemo(() => ({
    user, setUser,
    plan, setPlan,
    profile, setProfile,
    card, setCard,
    logout: () => { setUser(null); clearState(); },
  }), [user, plan, profile, card]);

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export const useApp = () => useContext(AppContext);