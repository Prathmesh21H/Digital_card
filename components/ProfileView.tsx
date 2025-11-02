'use client';
import { useEffect, useState } from 'react';
import { Phone, Mail, Globe, Linkedin, Twitter, Instagram, Facebook, Download, ChevronDown, ChevronUp, X, CheckCircle } from 'lucide-react';
import QRCode from 'qrcode';
import { useAuth } from '@/lib/AuthContext';

interface ProfileData {
  slug: string;
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
  qrCodeUrl?: string;
}

interface ProfileViewProps {
  profile: ProfileData;
  userId: string;
}

export default function ProfileView({ profile, userId }: ProfileViewProps) {
  const { user } = useAuth();
  const isOwner = user?.uid === userId;
  
  const [qrCode, setQrCode] = useState<string>('');
  const [qrLoading, setQrLoading] = useState(true);
  const [bioExpanded, setBioExpanded] = useState(false);
  const [showModal, setShowModal] = useState(false);
  
  // Check if bio needs "Read More"
  const bioCharLimit = 150;
  const needsReadMore = profile?.bio && profile.bio.length > bioCharLimit;
  const displayBio = needsReadMore && !bioExpanded && profile.bio
    ? profile.bio.substring(0, bioCharLimit) + '...' 
    : profile?.bio || '';

  useEffect(() => {
    const generateQRCode = async () => {
      try {
        const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || window.location.origin;
        const profileUrl = `${baseUrl}/${profile.slug}`;
        
        const qrDataUrl = await QRCode.toDataURL(profileUrl, {
          width: 300,
          margin: 2,
          color: {
            dark: '#FF6B35',
            light: '#FFFFFF',
          },
        });
        
        setQrCode(qrDataUrl);
      } catch (error) {
        console.error('Error generating QR code:', error);
      } finally {
        setQrLoading(false);
      }
    };

    if (isOwner) {
      generateQRCode();
    } else {
      setQrLoading(false);
    }
  }, [profile.slug, isOwner]);

  const handleDownloadVCard = async () => {
    try {
      const response = await fetch(`/api/vcard?userId=${userId}`);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${profile.slug}.vcf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      
      // Show modal after download
      setShowModal(true);
    } catch (error) {
      console.error('Error downloading vCard:', error);
    }
  };

  return (
    <div className="min-h-screen bg-white py-8 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden border-2 border-orange-100">
          {/* Header with Indian flag colors */}
          <div className="relative h-40 bg-gradient-to-r from-orange-500 via-white to-green-600">
            <div className="absolute inset-0 bg-gradient-to-b from-transparent to-white/30"></div>
            
            {/* Logo at top center */}
            <div className="absolute top-4 left-1/2 transform -translate-x-1/2">
              <img 
                src="/logo-bharat-valley.svg" 
                alt="Bharat Valley" 
                className="h-16 w-auto drop-shadow-lg"
              />
            </div>
          </div>
          
          {/* Profile Content */}
          <div className="relative px-6 pb-8">
            {/* Profile Image */}
            {profile.profileImage && (
              <div className="relative -mt-16 mb-4">
                <div className="w-32 h-32 mx-auto rounded-full border-4 border-orange-500 shadow-xl overflow-hidden bg-white p-1">
                  <img
                    src={profile.profileImage}
                    alt={profile.fullName}
                    className="w-full h-full rounded-full object-cover"
                  />
                </div>
              </div>
            )}

            {/* Name and Title */}
            <div className="text-center mb-6">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                {profile.fullName}
              </h1>
              {profile.designation && (
                <p className="text-lg text-orange-600 font-semibold">{profile.designation}</p>
              )}
              {profile.company && (
                <p className="text-md text-green-700 font-medium">{profile.company}</p>
              )}
            </div>

            {/* Bio with Read More */}
            {profile.bio && (
              <div className="mb-6">
                <div className="bg-gradient-to-r from-orange-50 to-green-50 rounded-xl p-5 border border-orange-200">
                  <p className="text-gray-700 leading-relaxed text-left whitespace-pre-line">
                    {displayBio}
                  </p>
                  {needsReadMore && (
                    <button
                      onClick={() => setBioExpanded(!bioExpanded)}
                      className="mt-3 text-orange-600 font-semibold flex items-center gap-1 hover:text-orange-700 transition"
                    >
                      {bioExpanded ? (
                        <>
                          Show Less <ChevronUp className="w-4 h-4" />
                        </>
                      ) : (
                        <>
                          Read More <ChevronDown className="w-4 h-4" />
                        </>
                      )}
                    </button>
                  )}
                </div>
              </div>
            )}

            {/* Contact Information */}
            <div className="space-y-3 mb-6">
              {profile.phone && (
                <a
                  href={`tel:${profile.phone}`}
                  className="flex items-center gap-3 p-4 rounded-xl hover:bg-orange-50 transition border-2 border-transparent hover:border-orange-300"
                >
                  <div className="bg-orange-500 p-2 rounded-lg">
                    <Phone className="w-5 h-5 text-white" />
                  </div>
                  <span className="text-gray-700 font-medium">{profile.phone}</span>
                </a>
              )}
              
              {profile.email && (
                <a
                  href={`mailto:${profile.email}`}
                  className="flex items-center gap-3 p-4 rounded-xl hover:bg-green-50 transition border-2 border-transparent hover:border-green-300"
                >
                  <div className="bg-green-600 p-2 rounded-lg">
                    <Mail className="w-5 h-5 text-white" />
                  </div>
                  <span className="text-gray-700 font-medium">{profile.email}</span>
                </a>
              )}
              
              {profile.website && (
                <a
                  href={profile.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 p-4 rounded-xl hover:bg-orange-50 transition border-2 border-transparent hover:border-orange-300"
                >
                  <div className="bg-orange-500 p-2 rounded-lg">
                    <Globe className="w-5 h-5 text-white" />
                  </div>
                  <span className="text-gray-700 font-medium">Visit Website</span>
                </a>
              )}
            </div>

            {/* Social Links */}
            {(profile.linkedin || profile.twitter || profile.instagram || profile.facebook) && (
              <div className="mb-6">
                <h3 className="text-sm font-bold text-gray-600 uppercase tracking-wide mb-3 text-center">
                  Connect With Me
                </h3>
                <div className="flex flex-wrap gap-3 justify-center">
                  {profile.linkedin && (
                    <a
                      href={profile.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition shadow-md"
                    >
                      <Linkedin className="w-4 h-4" />
                      LinkedIn
                    </a>
                  )}
                  
                  {profile.twitter && (
                    <a
                      href={profile.twitter}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 px-4 py-2 bg-sky-500 text-white rounded-lg hover:bg-sky-600 transition shadow-md"
                    >
                      <Twitter className="w-4 h-4" />
                      Twitter
                    </a>
                  )}
                  
                  {profile.instagram && (
                    <a
                      href={profile.instagram}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg hover:from-purple-600 hover:to-pink-600 transition shadow-md"
                    >
                      <Instagram className="w-4 h-4" />
                      Instagram
                    </a>
                  )}
                  
                  {profile.facebook && (
                    <a
                      href={profile.facebook}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 px-4 py-2 bg-blue-700 text-white rounded-lg hover:bg-blue-800 transition shadow-md"
                    >
                      <Facebook className="w-4 h-4" />
                      Facebook
                    </a>
                  )}
                </div>
              </div>
            )}

            {/* QR Code - Only visible to owner */}
            {isOwner && (
              <div className="mb-6 text-center">
                <h3 className="text-sm font-bold text-gray-600 uppercase tracking-wide mb-3">
                  Scan to Connect
                </h3>
                <div className="inline-block p-4 bg-gradient-to-br from-orange-50 to-green-50 border-2 border-orange-300 rounded-2xl shadow-lg">
                  {qrLoading ? (
                    <div className="w-48 h-48 flex items-center justify-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-4 border-orange-500 border-t-transparent"></div>
                    </div>
                  ) : qrCode ? (
                    <img
                      src={qrCode}
                      alt="QR Code"
                      className="w-48 h-48"
                    />
                  ) : (
                    <div className="w-48 h-48 flex items-center justify-center text-gray-400">
                      Unable to generate QR code
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Save Contact Button */}
            <button
              onClick={handleDownloadVCard}
              className="w-full flex items-center justify-center gap-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white py-5 rounded-2xl font-bold text-lg hover:from-orange-600 hover:to-orange-700 transition shadow-xl hover:shadow-2xl transform hover:scale-[1.02] active:scale-[0.98]"
            >
              <Download className="w-6 h-6" />
              Save to Contacts
            </button>

            {/* Footer */}
            <div className="mt-8 pt-6 border-t-2 border-orange-200 text-center">
              <p className="text-sm text-gray-500 font-medium">
                Powered by <span className="text-orange-600 font-bold">Bharat Valley</span>
              </p>
              <div className="mt-2 flex items-center justify-center gap-2">
                <div className="w-3 h-3 rounded-full bg-orange-500"></div>
                <div className="w-3 h-3 rounded-full bg-white border-2 border-gray-300"></div>
                <div className="w-3 h-3 rounded-full bg-green-600"></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Success Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 px-4">
          <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full p-8 relative animate-bounce-in">
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition"
            >
              <X className="w-6 h-6" />
            </button>
            
            <div className="text-center">
              <div className="mb-4 inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full">
                <CheckCircle className="w-10 h-10 text-green-600" />
              </div>
              
              <h3 className="text-2xl font-bold text-gray-900 mb-3">
                Contact Card Downloaded!
              </h3>
              
              <div className="bg-gradient-to-r from-orange-50 to-green-50 rounded-xl p-4 mb-6 border-2 border-orange-200">
                <p className="text-gray-700 leading-relaxed">
                  <span className="font-semibold text-orange-600">Next Step:</span> Tap on the downloaded file to open it, then click <span className="font-semibold">&quot;Add to Contacts&quot;</span> to save my contact information.
                </p>
              </div>

              <div className="space-y-2 text-sm text-gray-600 mb-6">
                <div className="flex items-center gap-2 justify-center">
                  <div className="w-8 h-8 bg-orange-500 text-white rounded-full flex items-center justify-center font-bold">1</div>
                  <span>Find the downloaded .vcf file</span>
                </div>
                <div className="flex items-center gap-2 justify-center">
                  <div className="w-8 h-8 bg-orange-500 text-white rounded-full flex items-center justify-center font-bold">2</div>
                  <span>Tap to open it</span>
                </div>
                <div className="flex items-center gap-2 justify-center">
                  <div className="w-8 h-8 bg-green-600 text-white rounded-full flex items-center justify-center font-bold">3</div>
                  <span>Click &quot;Add to Contacts&quot;</span>
                </div>
              </div>
              
              <button
                onClick={() => setShowModal(false)}
                className="w-full bg-gradient-to-r from-orange-500 to-orange-600 text-white py-3 rounded-xl font-semibold hover:from-orange-600 hover:to-orange-700 transition shadow-lg"
              >
                Got It!
              </button>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes bounce-in {
          0% {
            opacity: 0;
            transform: scale(0.3);
          }
          50% {
            opacity: 1;
            transform: scale(1.05);
          }
          70% {
            transform: scale(0.9);
          }
          100% {
            transform: scale(1);
          }
        }
        .animate-bounce-in {
          animation: bounce-in 0.5s ease-out;
        }
      `}</style>
    </div>
  );
}