// src/pages/Dashboard.jsx
import CardPreview from "../components/CardPreview";
import { useApp } from "../context/AppContext";
import { Link } from "react-router-dom";
import { useRef } from "react";
import html2canvas from "html2canvas";

export default function Dashboard() {
  const { plan, profile } = useApp();
  const cardRef = useRef(null);

  const shareUrl = `https://cardly.example/${(profile.fullName || "your-name")
    .toLowerCase()
    .replace(/\s+/g, "-")}`;

  const downloadCard = async () => {
    if (!cardRef.current) return;

    const canvas = await html2canvas(cardRef.current, {
      scale: 2,
      backgroundColor: null,
    });

    const link = document.createElement("a");
    link.download = "my-digital-card.png";
    link.href = canvas.toDataURL("image/png");
    link.click();
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-10">
      {/* Header */}
      <div className="mb-10 flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-gray-500 mt-1">
            Manage, share, and customize your digital card
          </p>
        </div>

        <span className="mt-4 sm:mt-0 inline-flex items-center px-4 py-1.5 rounded-full text-sm font-medium bg-blue-100 text-blue-700 capitalize">
          {plan} plan
        </span>
      </div>

      <div className="grid lg:grid-cols-3 gap-8 items-start">
        {/* MAIN CARD */}
        <div className="lg:col-span-2 bg-white rounded-3xl shadow-sm border p-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold">Your Digital Card</h2>

            <button
              onClick={downloadCard}
              className="text-sm px-4 py-2 rounded-xl bg-gray-900 text-white hover:bg-black transition"
            >
              Download Card
            </button>
          </div>

          <div className="flex justify-center">
            <div ref={cardRef}>
              <CardPreview />
            </div>
          </div>
        </div>

        {/* SIDEBAR */}
        <aside className="space-y-6">
          {/* Share */}
          <div className="bg-white rounded-2xl shadow-sm border p-6">
            <h3 className="font-semibold mb-2">Share Your Card</h3>

            <div className="bg-gray-50 border rounded-xl p-3 text-xs break-all text-gray-700">
              {shareUrl}
            </div>

            <button
              onClick={() => navigator.clipboard.writeText(shareUrl)}
              className="mt-3 w-full px-4 py-2 rounded-xl bg-blue-600 text-white font-medium hover:bg-blue-700 transition"
            >
              Copy Link
            </button>
          </div>

          {/* Actions */}
          <div className="bg-white rounded-2xl shadow-sm border p-6">
            <h3 className="font-semibold mb-4">Edit Your Card</h3>

            <div className="grid grid-cols-2 gap-3">
              <Link
                to="/profile"
                className="text-center px-4 py-2 rounded-xl border hover:bg-gray-50 font-medium"
              >
                Profile
              </Link>

              <Link
                to="/create"
                className="text-center px-4 py-2 rounded-xl border hover:bg-gray-50 font-medium"
              >
                Design
              </Link>
            </div>
          </div>

          {/* Plan */}
          <div className="bg-gradient-to-br from-blue-600 to-indigo-600 text-white rounded-2xl p-6 shadow-sm">
            <h3 className="font-semibold mb-1">Current Plan</h3>
            <p className="text-sm opacity-90 capitalize">{plan}</p>

            <Link
              to="/pricing"
              className="inline-block mt-3 text-sm font-medium underline underline-offset-4"
            >
              Upgrade Plan
            </Link>
          </div>
        </aside>
      </div>
    </div>
  );
}
