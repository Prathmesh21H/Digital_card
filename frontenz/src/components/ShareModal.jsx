"use client";

import React, { useState, useEffect } from "react";
import { X, Phone, Mail, Download, Copy, Check, Loader2 } from "lucide-react";

const ShareModal = ({ card, onClose }) => {
  const [copied, setCopied] = useState(false);
  const [shareUrl, setShareUrl] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);

  useEffect(() => {
    if (card) {
      const slug = card.cardLink || card.cardId || card._id;
      const url = `${window.location.origin}/p/${slug}`;
      setShareUrl(url);
    }
  }, [card]);

  if (!card) return null;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadImage = () => {
    setIsGenerating(true);

    // 1. Setup Canvas
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");

    // High resolution for crisp text (600px wide)
    const width = 600;
    const height = 750;
    canvas.width = width;
    canvas.height = height;

    // 2. Draw White Background
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, width, height);

    // 3. Prepare QR Image
    const qrSize = 400;
    const qrX = (width - qrSize) / 2; // Center horizontally
    const qrY = 50; // Top padding

    const qrImg = new Image();
    // Use the API URL
    qrImg.src = `https://api.qrserver.com/v1/create-qr-code/?size=1000x1000&data=${encodeURIComponent(
      shareUrl
    )}`;
    qrImg.crossOrigin = "Anonymous"; // Essential for saving canvas to file

    qrImg.onload = () => {
      // -- Optional: Draw a subtle shadow/border box for the QR code like the screenshot --
      // Save context
      ctx.save();
      // Draw shadow
      ctx.shadowColor = "rgba(0, 0, 0, 0.1)";
      ctx.shadowBlur = 20;
      ctx.shadowOffsetX = 0;
      ctx.shadowOffsetY = 10;
      // Draw rounded rectangle background for QR
      ctx.fillStyle = "#ffffff";
      roundRect(ctx, qrX - 20, qrY - 20, qrSize + 40, qrSize + 40, 20);
      ctx.fill();
      ctx.restore();

      // 4. Draw QR Code
      ctx.drawImage(qrImg, qrX, qrY, qrSize, qrSize);

      // 5. Draw Name
      ctx.font = "bold 32px sans-serif"; // Tailwind 'font-sans' style
      ctx.fillStyle = "#0f172a"; // slate-900
      ctx.textAlign = "center";
      // Name position: below QR code
      const name = card.fullName || "Digital Card";
      ctx.fillText(name, width / 2, qrY + qrSize + 80);

      // 6. Draw Subtitle
      ctx.font = "20px sans-serif";
      ctx.fillStyle = "#64748b"; // slate-500
      ctx.fillText("Scan to view card", width / 2, qrY + qrSize + 120);

      // 7. Convert to File and Download
      const dataUrl = canvas.toDataURL("image/png");
      const link = document.createElement("a");

      // Sanitize filename
      const safeName = (card.fullName || "card")
        .trim()
        .replace(/\s+/g, "-")
        .replace(/[^a-zA-Z0-9-_]/g, "");

      link.href = dataUrl;
      link.download = `${safeName}-QR.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      setIsGenerating(false);
    };

    qrImg.onerror = () => {
      console.error("Failed to load QR code image");
      alert("Failed to generate image. Please try again.");
      setIsGenerating(false);
    };
  };

  // Helper function to draw rounded rectangles on Canvas
  const roundRect = (ctx, x, y, w, h, r) => {
    if (w < 2 * r) r = w / 2;
    if (h < 2 * r) r = h / 2;
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.arcTo(x + w, y, x + w, y + h, r);
    ctx.arcTo(x + w, y + h, x, y + h, r);
    ctx.arcTo(x, y + h, x, y, r);
    ctx.arcTo(x, y, x + w, y, r);
    ctx.closePath();
    return ctx;
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      ></div>

      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md relative z-10 overflow-hidden animate-fadeIn">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
          <h3 className="font-semibold text-gray-800">Share Card</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 rounded-full p-1 hover:bg-gray-200 transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        <div className="p-8 flex flex-col items-center">
          {/* QR Code Preview Display (UI Only) */}
          <div className="bg-white p-6 rounded-3xl border-2 border-gray-100 shadow-sm mb-6 relative group">
            <img
              src={`https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(
                shareUrl
              )}`}
              alt="QR Code"
              className="w-48 h-48 object-contain"
            />
          </div>

          <h4 className="font-bold text-xl text-gray-900 mb-1 text-center">
            {card.fullName}
          </h4>
          <p className="text-gray-500 text-sm mb-6 text-center max-w-[80%]">
            Scan to view card
          </p>

          {/* Copy Link Section */}
          <div className="w-full flex items-center gap-2 mb-6 bg-gray-50 p-3 rounded-lg border border-gray-200">
            <div className="text-sm text-gray-500 truncate flex-1 font-mono">
              {shareUrl}
            </div>
            <button
              onClick={handleCopyLink}
              className="text-blue-600 hover:text-blue-700 font-medium text-sm flex items-center gap-1"
            >
              {copied ? <Check size={16} /> : <Copy size={16} />}
              {copied ? "Copied" : "Copy"}
            </button>
          </div>

          {/* Share Actions Grid */}
          <div className="grid grid-cols-3 gap-4 w-full border-t border-gray-100 pt-6">
            <a
              href={`https://wa.me/?text=Check out my digital card: ${encodeURIComponent(
                shareUrl
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex flex-col items-center gap-2 group cursor-pointer"
            >
              <div className="w-12 h-12 bg-green-50 text-green-600 rounded-full flex items-center justify-center group-hover:bg-green-100 transition-colors shadow-sm">
                <Phone size={20} />
              </div>
              <span className="text-xs font-medium text-gray-600">
                WhatsApp
              </span>
            </a>

            <a
              href={`mailto:?subject=My Digital Card&body=Here is my digital business card: ${shareUrl}`}
              className="flex flex-col items-center gap-2 group cursor-pointer"
            >
              <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center group-hover:bg-blue-100 transition-colors shadow-sm">
                <Mail size={20} />
              </div>
              <span className="text-xs font-medium text-gray-600">Email</span>
            </a>

            <button
              onClick={handleDownloadImage}
              disabled={isGenerating}
              className="flex flex-col items-center gap-2 group cursor-pointer disabled:opacity-50"
            >
              <div className="w-12 h-12 bg-gray-900 text-white rounded-full flex items-center justify-center group-hover:bg-black transition-colors shadow-sm">
                {isGenerating ? (
                  <Loader2 size={20} className="animate-spin" />
                ) : (
                  <Download size={20} />
                )}
              </div>
              <span className="text-xs font-medium text-gray-600">
                {isGenerating ? "Saving..." : "Save Image"}
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShareModal;