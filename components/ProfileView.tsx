'use client';
import { useState, useMemo } from 'react';
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
}

interface ProfileViewProps {
  profile: ProfileData;
  userId: string;
}

// Theme configurations for different companies
const companyThemes = {
  'Bharat Valley': {
    logo: '/logo-bharat-valley.svg',
    logoSize: 'h-20 w-auto',
    headerHeight: 'h-32',
    headerGradient: 'from-orange-500 via-white to-green-600',
    primaryColor: 'orange',
    secondaryColor: 'green',
    borderColor: 'border-gray-100',
    primaryBg: 'bg-orange-500',
    primaryHover: 'hover:bg-orange-600',
    primaryText: 'text-orange-600',
    secondaryBg: 'bg-green-600',
    secondaryText: 'text-green-700',
    buttonGradient: 'from-orange-500 to-orange-600',
    buttonHover: 'hover:from-orange-600 hover:to-orange-700',
    bioGradient: 'from-orange-50/50 to-green-50/50',
    bioBorder: 'border-gray-200',
    accentColors: ['bg-orange-500', 'bg-gray-300', 'bg-green-600'],
    contactHover: 'hover:bg-gray-50',
    contactIcon: 'bg-orange-500',
    contactIcon2: 'bg-green-600',
  },
  'Transformatrix': {
    logo: '/tx-logo.png',
    logoSize: 'w-72 h-auto',
    headerHeight: 'h-32',
    headerGradient: 'from-blue-600 via-white to-green-500',
    primaryColor: 'blue',
    secondaryColor: 'green',
    borderColor: 'border-gray-100',
    primaryBg: 'bg-blue-600',
    primaryHover: 'hover:bg-blue-700',
    primaryText: 'text-blue-600',
    secondaryBg: 'bg-green-500',
    secondaryText: 'text-green-600',
    buttonGradient: 'from-blue-600 to-blue-700',
    buttonHover: 'hover:from-blue-700 hover:to-blue-800',
    bioGradient: 'from-blue-50/50 to-green-50/50',
    bioBorder: 'border-gray-200',
    accentColors: ['bg-blue-600', 'bg-gray-300', 'bg-green-500'],
    contactHover: 'hover:bg-gray-50',
    contactIcon: 'bg-blue-600',
    contactIcon2: 'bg-green-500',
  },
};

export default function ProfileView({ profile, userId }: ProfileViewProps) {
  const [bioExpanded, setBioExpanded] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [downloadedFileName, setDownloadedFileName] = useState('');
  
  // Determine theme based on company
  const theme = useMemo(() => {
    const company = profile.company || '';
    if (company.toLowerCase().includes('transformatrix')) {
      return companyThemes['Transformatrix'];
    }
    return companyThemes['Bharat Valley']; // Default theme
  }, [profile.company]);
  
  // Check if bio needs "Read More"
  const bioCharLimit = 150;
  const needsReadMore = profile?.bio && profile.bio.length > bioCharLimit;
  const displayBio = needsReadMore && !bioExpanded && profile.bio
    ? profile.bio.substring(0, bioCharLimit) + '...' 
    : profile?.bio || '';

  const handleDownloadVCard = async () => {
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
      
      // Save filename and show modal
      setDownloadedFileName(fileName);
      setShowModal(true);
    } catch (error) {
      console.error('Error downloading vCard:', error);
    }
  };

  const handleWhatsAppClick = () => {
    if (!profile.phone) return;
    
    // Remove any non-numeric characters from phone number
    const cleanPhone = profile.phone.replace(/\D/g, '');
    
    // Pre-filled message
    const message = encodeURIComponent(`Hi ${profile.fullName}, I found your digital card!`);
    
    // WhatsApp URL
    const whatsappUrl = `https://wa.me/${cleanPhone}?text=${message}`;
    
    // Open in new tab
    window.open(whatsappUrl, '_blank');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-xl mx-auto md:py-12">
        <div className={`bg-white md:rounded-2xl md:shadow-lg overflow-hidden md:border ${theme.borderColor}`}>
          {/* Header with Logo - Clean & Minimal */}
          <div className={`relative ${theme.headerHeight} bg-gradient-to-r ${theme.headerGradient} flex items-center justify-center`}>
            <div className="absolute inset-0 bg-gradient-to-b from-transparent to-white/10"></div>
            <img 
              src={theme.logo}
              alt={profile.company || 'Company Logo'} 
              className={`${theme.logoSize} drop-shadow-lg relative z-10`}
            />
          </div>
          
          {/* Profile Content */}
          <div className="relative px-5 py-8 md:px-8 md:py-10">
            {/* Profile Image - Elegant & Refined */}
            {profile.profileImage && (
              <div className="flex justify-center mb-8">
                <div className={`w-32 h-32 rounded-full border-2 border-gray-200 shadow-sm overflow-hidden bg-white`}>
                  <img
                    src={profile.profileImage}
                    alt={profile.fullName}
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            )}

            {/* Name and Title - Sophisticated Typography */}
            <div className="text-center mb-8">
              <h1 className="text-2xl font-semibold text-gray-900 mb-1.5 tracking-tight">
                {profile.fullName}
              </h1>
              {profile.designation && (
                <p className={`text-base ${theme.primaryText} font-medium mb-0.5`}>{profile.designation}</p>
              )}
              {profile.company && (
                <p className="text-sm text-gray-600 font-normal">{profile.company}</p>
              )}
            </div>

            {/* Bio - Clean & Minimal */}
            {profile.bio && (
              <div className="mb-8">
                <div className={`bg-gray-50 rounded-lg p-5 border ${theme.bioBorder}`}>
                  <p className="text-sm text-gray-700 leading-relaxed text-left whitespace-pre-line">
                    {displayBio}
                  </p>
                  {needsReadMore && (
                    <button
                      onClick={() => setBioExpanded(!bioExpanded)}
                      className={`mt-3 ${theme.primaryText} text-sm font-medium flex items-center gap-1 hover:opacity-70 transition-opacity`}
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

            {/* Contact Information - Refined & Professional */}
            <div className="space-y-2.5 mb-8">
              {profile.phone && (
                <a 
                  href={`tel:${profile.phone}`}
                  className={`flex items-center gap-3 p-3.5 rounded-lg ${theme.contactHover} transition-colors border border-gray-200`}
                >
                  <div className={`${theme.contactIcon} p-2 rounded-md`}>
                    <Phone className="w-4 h-4 text-white" />
                  </div>
                  <span className="text-sm text-gray-700 font-medium">{profile.phone}</span>
                </a>
              )}
              
              {profile.email && (
                <a 
                  href={`mailto:${profile.email}`}
                  className={`flex items-center gap-3 p-3.5 rounded-lg ${theme.contactHover} transition-colors border border-gray-200`}
                >
                  <div className={`${theme.contactIcon2} p-2 rounded-md`}>
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
                  className={`flex items-center gap-3 p-3.5 rounded-lg ${theme.contactHover} transition-colors border border-gray-200`}
                >
                  <div className={`${theme.contactIcon} p-2 rounded-md`}>
                    <Globe className="w-4 h-4 text-white" />
                  </div>
                  <span className="text-sm text-gray-700 font-medium">Visit Website</span>
                </a>
              )}
            </div>

            {/* Social Links - Minimal & Professional */}
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

            {/* Action Buttons - Executive Style */}
            <div className="space-y-2.5">
              <button
                onClick={handleDownloadVCard}
                className={`w-full flex items-center justify-center gap-2 bg-gradient-to-r ${theme.buttonGradient} text-white py-3 px-6 rounded-lg font-medium text-sm ${theme.buttonHover} transition-all duration-200 shadow-sm hover:shadow-md`}
              >
                <Download className="w-4 h-4" />
                Save Contact
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

            {/* Footer - Subtle & Professional */}
            <div className={`mt-10 pt-6 border-t ${theme.bioBorder} text-center`}>
              <p className="text-xs text-gray-400 font-normal">
                Powered by <span className={`${theme.primaryText} font-medium`}>{profile.company || 'Bharat Valley'}</span>
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Success Modal - Refined */}
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
                  <span className={`font-medium ${theme.primaryText}`}>Next:</span> Open the downloaded file and tap <span className="font-medium">&quot;Add to Contacts&quot;</span> to save.
                </p>
              </div>

              <div className="space-y-2.5 text-sm text-gray-600 mb-6">
                <div className="flex items-start gap-3">
                  <div className={`w-6 h-6 ${theme.primaryBg} text-white rounded-full flex items-center justify-center font-medium text-xs flex-shrink-0 mt-0.5`}>1</div>
                  <span className="text-left">Find <span className="font-medium text-gray-800">{downloadedFileName}</span></span>
                </div>
                <div className="flex items-start gap-3">
                  <div className={`w-6 h-6 ${theme.primaryBg} text-white rounded-full flex items-center justify-center font-medium text-xs flex-shrink-0 mt-0.5`}>2</div>
                  <span className="text-left">Tap to open the file</span>
                </div>
                <div className="flex items-start gap-3">
                  <div className={`w-6 h-6 ${theme.contactIcon2} text-white rounded-full flex items-center justify-center font-medium text-xs flex-shrink-0 mt-0.5`}>3</div>
                  <span className="text-left">Select &quot;Add to Contacts&quot;</span>
                </div>
              </div>
              
              <button
                onClick={() => setShowModal(false)}
                className={`w-full bg-gradient-to-r ${theme.buttonGradient} text-white py-3 rounded-lg font-medium text-sm ${theme.buttonHover} transition-all duration-200 shadow-sm`}
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