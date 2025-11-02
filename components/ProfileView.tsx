'use client';
import { useState } from 'react';
import { Phone, Mail, Globe, Linkedin, Twitter, Instagram, Facebook, Download, ChevronDown, ChevronUp, X, CheckCircle, MessageCircle } from 'lucide-react';

interface ProfileData {
  fullName: string;
  designation?: string;
  company?: string;
  bio?: string;
  profileImage?: string;
  phone?: string;
  email?: string;
  website?: string;
  linkedin?: string;
  twitter?: string;
  instagram?: string;
  facebook?: string;
  logoUrl?: string;
  primaryColor?: string;
  secondaryColor?: string;
}

interface ProfileViewProps {
  profile: ProfileData;
  userId: string;
}

// Color mapping for Tailwind colors to hex
const colorMap: Record<string, { primary: string; secondary: string; light: string; lighter: string }> = {
  orange: { primary: '#f97316', secondary: '#ea580c', light: '#fed7aa', lighter: '#ffedd5' },
  blue: { primary: '#2563eb', secondary: '#1d4ed8', light: '#bfdbfe', lighter: '#dbeafe' },
  purple: { primary: '#9333ea', secondary: '#7e22ce', light: '#d8b4fe', lighter: '#e9d5ff' },
  red: { primary: '#dc2626', secondary: '#b91c1c', light: '#fca5a5', lighter: '#fecaca' },
  green: { primary: '#16a34a', secondary: '#15803d', light: '#86efac', lighter: '#bbf7d0' },
  teal: { primary: '#0d9488', secondary: '#0f766e', light: '#5eead4', lighter: '#99f6e4' },
  pink: { primary: '#ec4899', secondary: '#db2777', light: '#f9a8d4', lighter: '#fbcfe8' },
  indigo: { primary: '#4f46e5', secondary: '#4338ca', light: '#a5b4fc', lighter: '#c7d2fe' },
  cyan: { primary: '#06b6d4', secondary: '#0891b2', light: '#a5f3fc', lighter: '#cffafe' },
  amber: { primary: '#f59e0b', secondary: '#d97706', light: '#fcd34d', lighter: '#fef3c7' },
  lime: { primary: '#84cc16', secondary: '#65a30d', light: '#d9f99d', lighter: '#ecfccb' },
  emerald: { primary: '#10b981', secondary: '#059669', light: '#6ee7b7', lighter: '#d1fae5' },
  sky: { primary: '#0ea5e9', secondary: '#0284c7', light: '#7dd3fc', lighter: '#e0f2fe' },
  violet: { primary: '#8b5cf6', secondary: '#7c3aed', light: '#c4b5fd', lighter: '#ede9fe' },
  fuchsia: { primary: '#d946ef', secondary: '#c026d3', light: '#f0abfc', lighter: '#fae8ff' },
  rose: { primary: '#f43f5e', secondary: '#e11d48', light: '#fda4af', lighter: '#ffe4e6' },
};

// Helper to check if a color is a hex code
const isHexColor = (color: string): boolean => {
  return /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(color);
};

// Helper to adjust hex color brightness
const adjustHexBrightness = (hex: string, percent: number): string => {
  const num = parseInt(hex.replace('#', ''), 16);
  const amt = Math.round(2.55 * percent);
  const R = (num >> 16) + amt;
  const G = (num >> 8 & 0x00FF) + amt;
  const B = (num & 0x0000FF) + amt;
  return '#' + (
    0x1000000 +
    (R < 255 ? (R < 1 ? 0 : R) : 255) * 0x10000 +
    (G < 255 ? (G < 1 ? 0 : G) : 255) * 0x100 +
    (B < 255 ? (B < 1 ? 0 : B) : 255)
  ).toString(16).slice(1);
};

export default function ProfileView({ profile, userId }: ProfileViewProps) {
  const [bioExpanded, setBioExpanded] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [downloadedFileName, setDownloadedFileName] = useState('');
  const [isDownloading, setIsDownloading] = useState(false);
  
  // Get theme colors from profile (dynamic)
  const primaryColor = profile.primaryColor || 'orange';
  const secondaryColor = profile.secondaryColor || 'green';
  const logoUrl = profile.logoUrl || '/logo-bharat-valley.svg';
  
  // Get actual hex colors - support both preset names and custom hex
  const getColorShades = (color: string) => {
    if (isHexColor(color)) {
      // Custom hex color
      return {
        primary: color,
        primaryDark: adjustHexBrightness(color, -15),
        primaryLight: adjustHexBrightness(color, 40),
        primaryLighter: adjustHexBrightness(color, 60),
      };
    } else {
      // Preset color name
      const preset = colorMap[color] || colorMap.orange;
      return {
        primary: preset.primary,
        primaryDark: preset.secondary,
        primaryLight: preset.light,
        primaryLighter: preset.lighter,
      };
    }
  };

  const primaryShades = getColorShades(primaryColor);
  const secondaryShades = getColorShades(secondaryColor);

  const colors = {
    primary: primaryShades.primary,
    primaryDark: primaryShades.primaryDark,
    primaryLight: primaryShades.primaryLight,
    primaryLighter: primaryShades.primaryLighter,
    secondary: secondaryShades.primary,
    secondaryDark: secondaryShades.primaryDark,
    secondaryLight: secondaryShades.primaryLight,
    secondaryLighter: secondaryShades.primaryLighter,
  };
  
  // Check if bio needs "Read More"
  const bioCharLimit = 150;
  const needsReadMore = profile?.bio && profile.bio.length > bioCharLimit;
  const displayBio = needsReadMore && !bioExpanded && profile.bio
    ? profile.bio.substring(0, bioCharLimit) + '...' 
    : profile?.bio || '';

  const handleDownloadVCard = async () => {
    setIsDownloading(true);
    try {
      const response = await fetch(`/api/vcard?userId=${userId}`);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      const fileName = `${profile.fullName.replace(/\s+/g, '-')}.vcf`;
      a.download = fileName;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      
      setDownloadedFileName(fileName);
      setShowModal(true);
    } catch (error) {
      console.error('Error downloading vCard:', error);
    } finally {
      setIsDownloading(false);
    }
  };

  const handleWhatsAppClick = () => {
    if (!profile.phone) return;
    const cleanPhone = profile.phone.replace(/\D/g, '');
    const message = encodeURIComponent(`Hi ${profile.fullName}, I found your digital card!`);
    const whatsappUrl = `https://wa.me/${cleanPhone}?text=${message}`;
    window.open(whatsappUrl, '_blank');
  };

  const formatPhoneDisplay = (phone: string) => {
    if (!phone) return '';
    const formatted = phone.replace(/^\+\d{1,3}/, '').replace(/[\s-]/g, '');
    if (formatted.length === 10) {
      return `${formatted.slice(0, 5)} ${formatted.slice(5)}`;
    }
    return formatted;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-xl mx-auto md:py-12">
        <div className="bg-white md:rounded-2xl md:shadow-lg overflow-hidden md:border border-gray-100">
          {/* Header with Logo - Dynamic Theme with INLINE STYLES */}
          <div 
            className="relative h-32 flex items-center justify-center"
            style={{
              background: `linear-gradient(to right, ${colors.primary}, white, ${colors.secondary})`
            }}
          >
            <div className="absolute inset-0 bg-gradient-to-b from-transparent to-white/10"></div>
            <img 
              src={logoUrl}
              alt={profile.company || 'Company Logo'} 
              className="h-20 w-auto drop-shadow-lg relative z-10 object-contain"
              onError={(e) => {
                // Fallback if logo fails to load
                e.currentTarget.src = '/logo-bharat-valley.svg';
              }}
            />
          </div>
          
          {/* Profile Content */}
          <div className="relative px-5 py-8 md:px-8 md:py-10">
            {/* Profile Image */}
            {profile.profileImage && (
              <div className="flex justify-center mb-8">
                <div className="w-32 h-32 rounded-full border-2 border-gray-200 shadow-sm overflow-hidden bg-white">
                  <img
                    src={profile.profileImage}
                    alt={profile.fullName}
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            )}

            {/* Name and Title */}
            <div className="text-center mb-8">
              <h1 className="text-2xl font-semibold text-gray-900 mb-1.5 tracking-tight">
                {profile.fullName}
              </h1>
              {profile.designation && (
                <p className="text-base font-medium mb-0.5" style={{ color: colors.primary }}>
                  {profile.designation}
                </p>
              )}
              {profile.company && (
                <p className="text-sm text-gray-600 font-normal">{profile.company}</p>
              )}
            </div>

            {/* Bio */}
            {profile.bio && (
              <div className="mb-8">
                <div className="bg-gray-50 rounded-lg p-5 border border-gray-200">
                  <p className="text-sm text-gray-700 leading-relaxed text-left whitespace-pre-line">
                    {displayBio}
                  </p>
                  {needsReadMore && (
                    <button
                      onClick={() => setBioExpanded(!bioExpanded)}
                      className="mt-3 text-sm font-medium flex items-center gap-1 hover:opacity-70 transition-opacity"
                      style={{ color: colors.primary }}
                    >
                      {bioExpanded ? (
                        <>
                          Show Less <ChevronUp className="w-3.5 h-3.5" />
                        </>
                      ) : (
                        <>
                          Read More <ChevronDown className="w-3.5 h-3.5" />
                        </>
                      )}
                    </button>
                  )}
                </div>
              </div>
            )}

            {/* Contact Information */}
            <div className="space-y-2.5 mb-8">
              {profile.phone && (
                <a 
                  href={`tel:${profile.phone}`}
                  className="flex items-center gap-3 p-3.5 rounded-lg hover:bg-gray-50 transition-colors border border-gray-200"
                >
                  <div className="p-2 rounded-md" style={{ backgroundColor: colors.primary }}>
                    <Phone className="w-4 h-4 text-white" />
                  </div>
                  <span className="text-sm text-gray-700 font-medium">{formatPhoneDisplay(profile.phone)}</span>
                </a>
              )}
              
              {profile.email && (
                <a 
                  href={`mailto:${profile.email}`}
                  className="flex items-center gap-3 p-3.5 rounded-lg hover:bg-gray-50 transition-colors border border-gray-200"
                >
                  <div className="p-2 rounded-md" style={{ backgroundColor: colors.secondary }}>
                    <Mail className="w-4 h-4 text-white" />
                  </div>
                  <span className="text-sm text-gray-700 font-medium">{profile.email}</span>
                </a>
              )}
              
              {profile.website && (
                <a 
                  href={profile.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 p-3.5 rounded-lg hover:bg-gray-50 transition-colors border border-gray-200"
                >
                  <div className="p-2 rounded-md" style={{ backgroundColor: colors.primary }}>
                    <Globe className="w-4 h-4 text-white" />
                  </div>
                  <span className="text-sm text-gray-700 font-medium">Visit Website</span>
                </a>
              )}
            </div>

            {/* Social Links */}
            {(profile.linkedin || profile.twitter || profile.instagram || profile.facebook) && (
              <div className="mb-8">
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-3 text-center">
                  Connect
                </p>
                <div className="flex flex-wrap gap-2 justify-center">
                  {profile.linkedin && (
                    <a 
                      href={profile.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1.5 px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-sm font-medium"
                    >
                      <Linkedin className="w-3.5 h-3.5" />
                      LinkedIn
                    </a>
                  )}
                  
                  {profile.twitter && (
                    <a 
                      href={profile.twitter}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1.5 px-3 py-2 bg-sky-500 text-white rounded-md hover:bg-sky-600 transition-colors text-sm font-medium"
                    >
                      <Twitter className="w-3.5 h-3.5" />
                      Twitter
                    </a>
                  )}
                  
                  {profile.instagram && (
                    <a 
                      href={profile.instagram}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1.5 px-3 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-md hover:from-purple-600 hover:to-pink-600 transition-colors text-sm font-medium"
                    >
                      <Instagram className="w-3.5 h-3.5" />
                      Instagram
                    </a>
                  )}
                  
                  {profile.facebook && (
                    <a 
                      href={profile.facebook}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1.5 px-3 py-2 bg-blue-700 text-white rounded-md hover:bg-blue-800 transition-colors text-sm font-medium"
                    >
                      <Facebook className="w-3.5 h-3.5" />
                      Facebook
                    </a>
                  )}
                </div>
              </div>
            )}

            {/* Action Buttons - Dynamic Theme with INLINE STYLES */}
            <div className="space-y-2.5">
              <button
                onClick={handleDownloadVCard}
                disabled={isDownloading}
                className="w-full flex items-center justify-center gap-2 text-white py-3 px-6 rounded-lg font-medium text-sm transition-all duration-200 shadow-sm hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
                style={{
                  background: `linear-gradient(to right, ${colors.primary}, ${colors.primaryDark})`,
                }}
                onMouseEnter={(e) => {
                  if (!isDownloading) {
                    e.currentTarget.style.background = `linear-gradient(to right, ${colors.primaryDark}, ${colors.primaryDark})`;
                  }
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = `linear-gradient(to right, ${colors.primary}, ${colors.primaryDark})`;
                }}
              >
                <Download className={`w-4 h-4 ${isDownloading ? 'animate-bounce' : ''}`} />
                {isDownloading ? 'Saving...' : 'Save Contact'}
              </button>

              {profile.phone && (
                <button
                  onClick={handleWhatsAppClick}
                  className="w-full flex items-center justify-center gap-2 bg-white text-gray-700 py-3 px-6 rounded-lg font-medium text-sm hover:bg-gray-50 transition-all duration-200 shadow-sm hover:shadow-md border border-gray-200"
                >
                  <MessageCircle className="w-4 h-4 text-green-600" />
                  Message on WhatsApp
                </button>
              )}
            </div>

            {/* Footer - Dynamic Theme */}
            <div className="mt-10 pt-6 border-t border-gray-200 text-center">
              <p className="text-xs text-gray-400 font-normal">
                Powered by <span className="font-medium" style={{ color: colors.primary }}>
                  {/* {profile.company || 'Bharat Valley'} */}
                  Bharat Valley Incubator & Accelerator Private Limited
                </span>
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Success Modal - Dynamic Theme */}
      {showModal && (
        <div className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center z-50 px-4">
          <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-8 relative animate-fade-in">
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
            
            <div className="text-center">
              <div className="mb-5 inline-flex items-center justify-center w-14 h-14 bg-green-50 rounded-full">
                <CheckCircle className="w-7 h-7 text-green-600" />
              </div>
              
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                Contact Saved
              </h3>
              
              <div className="bg-gray-50 rounded-lg p-4 mb-6 border border-gray-200">
                <p className="text-sm text-gray-700 leading-relaxed">
                  <span className="font-medium" style={{ color: colors.primary }}>Next:</span> Open the downloaded file and tap <span className="font-medium">&quot;Add to Contacts&quot;</span> to save.
                </p>
              </div>

              <div className="space-y-2.5 text-sm text-gray-600 mb-6">
                <div className="flex items-start gap-3">
                  <div 
                    className="w-6 h-6 text-white rounded-full flex items-center justify-center font-medium text-xs flex-shrink-0 mt-0.5"
                    style={{ backgroundColor: colors.primary }}
                  >
                    1
                  </div>
                  <span className="text-left">Find <span className="font-medium text-gray-800">{downloadedFileName}</span></span>
                </div>
                <div className="flex items-start gap-3">
                  <div 
                    className="w-6 h-6 text-white rounded-full flex items-center justify-center font-medium text-xs flex-shrink-0 mt-0.5"
                    style={{ backgroundColor: colors.primary }}
                  >
                    2
                  </div>
                  <span className="text-left">Tap to open the file</span>
                </div>
                <div className="flex items-start gap-3">
                  <div 
                    className="w-6 h-6 text-white rounded-full flex items-center justify-center font-medium text-xs flex-shrink-0 mt-0.5"
                    style={{ backgroundColor: colors.secondary }}
                  >
                    3
                  </div>
                  <span className="text-left">Select &quot;Add to Contacts&quot;</span>
                </div>
              </div>
              
              <button
                onClick={() => setShowModal(false)}
                className="w-full text-white py-3 rounded-lg font-medium text-sm transition-all duration-200 shadow-sm"
                style={{
                  background: `linear-gradient(to right, ${colors.primary}, ${colors.primaryDark})`,
                }}
              >
                Got It
              </button>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: scale(0.95);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
        .animate-fade-in {
          animation: fade-in 0.2s ease-out;
        }
      `}</style>
    </div>
  );
}