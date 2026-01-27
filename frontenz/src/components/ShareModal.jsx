"use client";

import React, { useState, useEffect } from "react";
import {
  X,
  Phone,
  Mail,
  Download,
  Copy,
  Check,
  Loader2,
  FileText,
} from "lucide-react";
import { jsPDF } from "jspdf"; // Import jsPDF

const ShareModal = ({ card, onClose }) => {
  const [copied, setCopied] = useState(false);
  const [shareUrl, setShareUrl] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [isPdfGenerating, setIsPdfGenerating] = useState(false);

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

  // --- NEW: PDF Generation Logic ---
  const handleDownloadPDF = async () => {
    setIsPdfGenerating(true);
    try {
      const doc = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
      });

      const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=400x400&data=${encodeURIComponent(
        shareUrl
      )}`;

      const img = new Image();
      img.src = qrUrl;
      img.crossOrigin = "Anonymous";

      img.onload = () => {
        const pageWidth = doc.internal.pageSize.getWidth();
        const qrSize = 80;
        const xPos = (pageWidth - qrSize) / 2;
        const yPos = 40;
        const cardPadding = 8;
        const cardSize = qrSize + cardPadding * 2;
        const cardX = xPos - cardPadding;
        const cardY = yPos - cardPadding;

        // 1. Create the "Uplifted" Shadow Effect
        // We draw 3 layers of slightly offset, light rectangles to simulate depth
        doc.setDrawColor(0, 0, 0);

        // Outer softest shadow
        doc.setGState(new doc.GState({ opacity: 0.02 }));
        doc.roundedRect(
          cardX - 1.5,
          cardY - 0.5,
          cardSize + 3,
          cardSize + 4,
          8,
          8,
          "F"
        );

        // Middle shadow
        doc.setGState(new doc.GState({ opacity: 0.05 }));
        doc.roundedRect(
          cardX - 0.5,
          cardY,
          cardSize + 1,
          cardSize + 2,
          8,
          8,
          "F"
        );

        // 2. Draw the Main White Card Face
        doc.setGState(new doc.GState({ opacity: 1.0 })); // Reset opacity
        doc.setFillColor(255, 255, 255);
        doc.setDrawColor(241, 245, 249); // slate-100 border
        doc.roundedRect(cardX, cardY, cardSize, cardSize, 8, 8, "FD");

        // 3. Add QR Image
        doc.addImage(img, "PNG", xPos, yPos, qrSize, qrSize);

        // 4. Draw Full Name (Styled as a clickable Link)
        const name = card.fullName || "Digital Card";
        doc.setFont("helvetica", "bold");
        doc.setFontSize(22);
        doc.setTextColor(15, 23, 42); // slate-900

        const textWidth = doc.getTextWidth(name);
        const textX = (pageWidth - textWidth) / 2;
        const textY = cardY + cardSize + 20;

        doc.text(name, textX, textY);

        // 5. Add "Scan to view card" Subtitle
        doc.setFont("helvetica", "normal");
        doc.setFontSize(14);
        doc.setTextColor(100, 116, 139); // slate-500
        doc.text("Scan to view card", pageWidth / 2, textY + 12, {
          align: "center",
        });

        // 6. ATTACH HYPERLINKS
        doc.link(cardX, cardY, cardSize, cardSize, { url: shareUrl });
        doc.link(textX, textY - 8, textWidth, 12, { url: shareUrl });

        const safeName = (card.fullName || "card").trim().replace(/\s+/g, "-");
        doc.save(`${safeName}-QR.pdf`);
        setIsPdfGenerating(false);
      };
    } catch (error) {
      console.error("PDF Generation Error:", error);
      setIsPdfGenerating(false);
    }
  };

  const handleDownloadImage = () => {
    setIsGenerating(true);
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    const width = 600;
    const height = 750;
    canvas.width = width;
    canvas.height = height;

    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, width, height);

    const qrSize = 400;
    const qrX = (width - qrSize) / 2;
    const qrY = 50;

    const qrImg = new Image();
    qrImg.src = `https://api.qrserver.com/v1/create-qr-code/?size=1000x1000&data=${encodeURIComponent(
      shareUrl
    )}`;
    qrImg.crossOrigin = "Anonymous";

    qrImg.onload = () => {
      ctx.save();
      ctx.shadowColor = "rgba(0, 0, 0, 0.1)";
      ctx.shadowBlur = 20;
      ctx.shadowOffsetX = 0;
      ctx.shadowOffsetY = 10;
      ctx.fillStyle = "#ffffff";
      roundRect(ctx, qrX - 20, qrY - 20, qrSize + 40, qrSize + 40, 20);
      ctx.fill();
      ctx.restore();

      ctx.drawImage(qrImg, qrX, qrY, qrSize, qrSize);
      ctx.font = "bold 32px sans-serif";
      ctx.fillStyle = "#0f172a";
      ctx.textAlign = "center";
      ctx.fillText(
        card.fullName || "Digital Card",
        width / 2,
        qrY + qrSize + 80
      );

      ctx.font = "20px sans-serif";
      ctx.fillStyle = "#64748b";
      ctx.fillText("Scan to view card", width / 2, qrY + qrSize + 120);

      const dataUrl = canvas.toDataURL("image/png");
      const link = document.createElement("a");
      const safeName = (card.fullName || "card")
        .trim()
        .replace(/\s+/g, "-")
        .replace(/[^a-zA-Z0-9-_]/g, "");
      link.href = dataUrl;
      link.download = `${safeName}-QR.png`;
      link.click();
      setIsGenerating(false);
    };
  };

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
          <p className="text-gray-500 text-sm mb-6 text-center">
            Scan or click link to view card
          </p>

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

          <div className="grid grid-cols-4 gap-2 w-full border-t border-gray-100 pt-6">
            <a
              href={`https://wa.me/?text=Check out my digital card: ${encodeURIComponent(
                shareUrl
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex flex-col items-center gap-2 group cursor-pointer"
            >
              <div className="w-10 h-10 bg-green-50 text-green-600 rounded-full flex items-center justify-center group-hover:bg-green-100 transition-colors shadow-sm">
                <Phone size={18} />
              </div>
              <span className="text-[10px] font-medium text-gray-600">
                WhatsApp
              </span>
            </a>

            <a
              href={`mailto:?subject=My Digital Card&body=Here is my digital business card: ${shareUrl}`}
              className="flex flex-col items-center gap-2 group cursor-pointer"
            >
              <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center group-hover:bg-blue-100 transition-colors shadow-sm">
                <Mail size={18} />
              </div>
              <span className="text-[10px] font-medium text-gray-600">
                Email
              </span>
            </a>

            <button
              onClick={handleDownloadImage}
              disabled={isGenerating}
              className="flex flex-col items-center gap-2 group cursor-pointer disabled:opacity-50"
            >
              <div className="w-10 h-10 bg-gray-900 text-white rounded-full flex items-center justify-center group-hover:bg-black transition-colors shadow-sm">
                {isGenerating ? (
                  <Loader2 size={18} className="animate-spin" />
                ) : (
                  <Download size={18} />
                )}
              </div>
              <span className="text-[10px] font-medium text-gray-600">
                Image
              </span>
            </button>

            {/* PDF BUTTON */}
            <button
              onClick={handleDownloadPDF}
              disabled={isPdfGenerating}
              className="flex flex-col items-center gap-2 group cursor-pointer disabled:opacity-50"
            >
              <div className="w-10 h-10 bg-red-50 text-red-600 rounded-full flex items-center justify-center group-hover:bg-red-100 transition-colors shadow-sm">
                {isPdfGenerating ? (
                  <Loader2 size={18} className="animate-spin" />
                ) : (
                  <FileText size={18} />
                )}
              </div>
              <span className="text-[10px] font-medium text-gray-600">
                PDF (Link)
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShareModal;
