// components/ProfileView.tsx
'use client';
import { useEffect, useState } from 'react';
import { Phone, Mail, Globe, Linkedin, Twitter, Instagram, Facebook, Download } from 'lucide-react';
import QRCode from 'qrcode';

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
  const [qrCode, setQrCode] = useState<string>('');
  const [qrLoading, setQrLoading] = useState(true);

  useEffect(() => {
    const generateQRCode = async () => {
      try {
        // Get the base URL - uses environment variable or current origin
        const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || window.location.origin;
        const profileUrl = `${baseUrl}/${profile.slug}`;
        
        const qrDataUrl = await QRCode.toDataURL(profileUrl, {
          width: 300,
          margin: 2,
          color: {
            dark: '#000000',
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

    generateQRCode();
  }, [profile.slug]);

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
    } catch (error) {
      console.error('Error downloading vCard:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          {/* Header with gradient */}
          <div className="h-32 bg-gradient-to-r from-indigo-500 to-purple-600"></div>
          
          {/* Profile Content */}
          <div className="relative px-6 pb-8">
            {/* Profile Image */}
            {profile.profileImage && (
              <div className="relative -mt-16 mb-4">
                <img
                  src={profile.profileImage}
                  alt={profile.fullName}
                  className="w-32 h-32 rounded-full border-4 border-white shadow-lg object-cover mx-auto"
                />
              </div>
            )}

            {/* Name and Title */}
            <div className="text-center mb-6">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                {profile.fullName}
              </h1>
              {profile.designation && (
                <p className="text-lg text-gray-600">{profile.designation}</p>
              )}
              {profile.company && (
                <p className="text-md text-gray-500">{profile.company}</p>
              )}
            </div>

            {/* Bio */}
            {profile.bio && (
              <div className="mb-6 text-center">
                <p className="text-gray-700 leading-relaxed">{profile.bio}</p>
              </div>
            )}

            {/* Contact Information */}
            <div className="space-y-3 mb-6">
              {profile.phone && (
                <a
                  href={`tel:${profile.phone}`}
                  className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition"
                >
                  <Phone className="w-5 h-5 text-indigo-600" />
                  <span className="text-gray-700">{profile.phone}</span>
                </a>
              )}
              
              {profile.email && (
                <a
                  href={`mailto:${profile.email}`}
                  className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition"
                >
                  <Mail className="w-5 h-5 text-indigo-600" />
                  <span className="text-gray-700">{profile.email}</span>
                </a>
              )}
              
              {profile.website && (
                <a
                  href={profile.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition"
                >
                  <Globe className="w-5 h-5 text-indigo-600" />
                  <span className="text-gray-700">Visit Website</span>
                </a>
              )}
            </div>

            {/* Social Links */}
            {(profile.linkedin || profile.twitter || profile.instagram || profile.facebook) && (
              <div className="mb-6">
                <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">
                  Connect
                </h3>
                <div className="flex flex-wrap gap-3">
                  {profile.linkedin && (
                    <a
                      href={profile.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition"
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
                      className="flex items-center gap-2 px-4 py-2 bg-sky-50 text-sky-700 rounded-lg hover:bg-sky-100 transition"
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
                      className="flex items-center gap-2 px-4 py-2 bg-pink-50 text-pink-700 rounded-lg hover:bg-pink-100 transition"
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
                      className="flex items-center gap-2 px-4 py-2 bg-indigo-50 text-indigo-700 rounded-lg hover:bg-indigo-100 transition"
                    >
                      <Facebook className="w-4 h-4" />
                      Facebook
                    </a>
                  )}
                </div>
              </div>
            )}

            {/* QR Code - Dynamically Generated */}
            <div className="mb-6 text-center">
              <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">
                Share My Card
              </h3>
              <div className="inline-block p-4 bg-white border-2 border-gray-200 rounded-lg">
                {qrLoading ? (
                  <div className="w-48 h-48 flex items-center justify-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
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

            {/* Save Contact Button */}
            <button
              onClick={handleDownloadVCard}
              className="w-full flex items-center justify-center gap-2 bg-indigo-600 text-white py-4 rounded-xl font-semibold hover:bg-indigo-700 transition shadow-lg"
            >
              <Download className="w-5 h-5" />
              Save to Contacts
            </button>

            {/* Footer */}
            <div className="mt-8 pt-6 border-t border-gray-200 text-center">
              <p className="text-sm text-gray-500">
                Powered by Digital Visiting Card
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}