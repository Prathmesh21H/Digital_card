// app/dashboard/page.tsx
'use client';
import { useEffect, useState, useRef, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/lib/AuthContext';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import QRCode from 'qrcode';
import { Download, ExternalLink, Edit, QrCode as QrCodeIcon } from 'lucide-react';

interface Profile {
  slug: string;
  fullName: string;
  designation?: string;
  company?: string;
  profileImage?: string;
}

// Theme configurations for different companies
const companyThemes = {
  'Bharat Valley': {
    logo: '/logo-bharat-valley.svg',
    bgGradient: 'from-orange-50 to-green-50',
    headerBorder: 'border-orange-200',
    primaryColor: 'orange',
    secondaryColor: 'green',
    borderColor: 'border-orange-100',
    primaryBg: 'bg-orange-500',
    primaryBorder: 'border-orange-500',
    primaryText: 'text-orange-600',
    buttonGradient: 'from-orange-500 to-orange-600',
    buttonHover: 'hover:from-orange-600 hover:to-orange-700',
    qrBg: 'from-orange-50 to-green-50',
    qrBorder: 'border-orange-300',
    accentBorder: 'border-orange-200',
    accentBg: 'from-orange-50 to-orange-100',
    accentHover: 'hover:from-orange-100 hover:to-orange-200',
    accentText: 'text-orange-700',
  },
  'Transformatrix': {
    logo: '/tx-logo.png',
    bgGradient: 'from-blue-50 to-green-50',
    headerBorder: 'border-blue-200',
    primaryColor: 'blue',
    secondaryColor: 'green',
    borderColor: 'border-blue-100',
    primaryBg: 'bg-blue-600',
    primaryBorder: 'border-blue-600',
    primaryText: 'text-blue-600',
    buttonGradient: 'from-blue-600 to-blue-700',
    buttonHover: 'hover:from-blue-700 hover:to-blue-800',
    qrBg: 'from-blue-50 to-green-50',
    qrBorder: 'border-blue-300',
    accentBorder: 'border-blue-200',
    accentBg: 'from-blue-50 to-blue-100',
    accentHover: 'hover:from-blue-100 hover:to-blue-200',
    accentText: 'text-blue-700',
  },
};

export default function DashboardPage() {
  const { user, loading, logout } = useAuth();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [profileLoading, setProfileLoading] = useState(true);
  const [qrCode, setQrCode] = useState<string>('');
  const [qrLoading, setQrLoading] = useState(true);
  const qrCanvasRef = useRef<HTMLCanvasElement>(null);
  const finalCanvasRef = useRef<HTMLCanvasElement>(null);
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  useEffect(() => {
    const fetchProfile = async () => {
      if (!user) return;
      
      try {
        const profileDoc = await getDoc(doc(db, 'profiles', user.uid));
        if (profileDoc.exists()) {
          setProfile(profileDoc.data() as Profile);
        }
      } catch (error) {
        console.error('Error fetching profile:', error);
      } finally {
        setProfileLoading(false);
      }
    };

    fetchProfile();
  }, [user]);

  useEffect(() => {
    const generateQRCode = async () => {
      if (!user || !profile) return;
      
      try {
        const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || window.location.origin;
        const profileUrl = `${baseUrl}/${user.uid}`;
        
        // Generate QR code on temporary canvas
        if (qrCanvasRef.current) {
          await QRCode.toCanvas(qrCanvasRef.current, profileUrl, {
            width: 800,
            margin: 2,
            color: {
              dark: '#000000',
              light: '#FFFFFF',
            },
          });

          // Create final canvas with QR code + username
          const finalCanvas = finalCanvasRef.current;
          if (!finalCanvas) return;

          const ctx = finalCanvas.getContext('2d');
          if (!ctx) return;

          // Set canvas size (QR code + space for text)
          const qrSize = 800;
          const textHeight = 120;
          const padding = 40;
          finalCanvas.width = qrSize + (padding * 2);
          finalCanvas.height = qrSize + textHeight + (padding * 2);

          // Fill white background
          ctx.fillStyle = '#FFFFFF';
          ctx.fillRect(0, 0, finalCanvas.width, finalCanvas.height);

          // Draw QR code
          ctx.drawImage(qrCanvasRef.current, padding, padding, qrSize, qrSize);

          // Draw username below QR code
          const textY = qrSize + padding + 40;
          
          // Draw name
          ctx.fillStyle = '#1F2937'; // gray-800
          ctx.font = 'bold 48px Arial, sans-serif';
          ctx.textAlign = 'center';
          ctx.textBaseline = 'top';
          ctx.fillText(profile.fullName, finalCanvas.width / 2, textY);

          // Draw URL below name (optional)
          if (profile.designation) {
            ctx.fillStyle = '#6B7280'; // gray-500
            ctx.font = '32px Arial, sans-serif';
            ctx.fillText(profile.designation, finalCanvas.width / 2, textY + 60);
          }

          // Generate preview image
          const qrDataUrl = finalCanvas.toDataURL('image/png');
          setQrCode(qrDataUrl);
        }
      } catch (error) {
        console.error('Error generating QR code:', error);
      } finally {
        setQrLoading(false);
      }
    };

    if (user && profile) {
      generateQRCode();
    }
  }, [user, profile]);

  const handleDownloadQR = () => {
    if (!finalCanvasRef.current || !profile) return;
    
    try {
      // Convert canvas to blob and download
      finalCanvasRef.current.toBlob((blob) => {
        if (!blob) return;
        
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${profile.fullName.replace(/\s+/g, '-')}-QR-Code.png`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      });
    } catch (error) {
      console.error('Error downloading QR code:', error);
    }
  };

  const handleLogout = async () => {
    await logout();
    router.push('/login');
  };

  if (loading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 to-green-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-green-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b-2 border-orange-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <img 
              src="/logo-bharat-valley.svg" 
              alt="Bharat Valley" 
              className="h-10 w-auto"
            />
            <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          </div>
          <button
            onClick={handleLogout}
            className="px-4 py-2 text-sm text-gray-700 hover:text-gray-900 border-2 border-gray-300 rounded-lg hover:bg-gray-50 transition font-medium"
          >
            Logout
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Welcome, {user.email}
          </h2>
          <p className="text-gray-600">Manage your digital visiting card</p>
        </div>

        {profileLoading ? (
          <div className="bg-white rounded-2xl shadow-lg p-8 text-center border-2 border-orange-100">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading profile...</p>
          </div>
        ) : profile ? (
          <div className="grid lg:grid-cols-3 gap-6">
            {/* Profile Card */}
            <div className="lg:col-span-1 bg-white rounded-2xl shadow-lg p-6 border-2 border-orange-100">
              <div className="flex items-start justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Your Profile</h3>
                <Link
                  href="/edit-profile"
                  className="text-sm text-orange-600 hover:text-orange-700 font-medium flex items-center gap-1"
                >
                  <Edit className="w-4 h-4" />
                  Edit
                </Link>
              </div>
              
              <div className="space-y-3">
                {profile.profileImage && (
                  <img 
                    src={profile.profileImage} 
                    alt={profile.fullName}
                    className="w-24 h-24 rounded-full object-cover mb-4 border-4 border-orange-500"
                  />
                )}
                <div>
                  <p className="text-sm text-gray-600">Name</p>
                  <p className="font-medium text-gray-900">{profile.fullName}</p>
                </div>
                {profile.designation && (
                  <div>
                    <p className="text-sm text-gray-600">Designation</p>
                    <p className="font-medium text-gray-900">{profile.designation}</p>
                  </div>
                )}
                {profile.company && (
                  <div>
                    <p className="text-sm text-gray-600">Company</p>
                    <p className="font-medium text-gray-900">{profile.company}</p>
                  </div>
                )}
              </div>
            </div>

            {/* QR Code Card */}
            <div className="lg:col-span-2 bg-white rounded-2xl shadow-lg p-6 border-2 border-orange-100">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                    <QrCodeIcon className="w-5 h-5 text-orange-600" />
                    Your QR Code
                  </h3>
                  <p className="text-sm text-gray-600 mt-1">Share this to let others scan and save your contact</p>
                </div>
              </div>
              
              <div className="flex flex-col md:flex-row gap-6 items-center">
                {/* QR Code Display with Username */}
                <div className="flex-shrink-0">
                  <div className="bg-white p-4 rounded-2xl border-2 border-orange-300 shadow-lg">
                    {qrLoading ? (
                      <div className="w-80 h-96 flex items-center justify-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-4 border-orange-500 border-t-transparent"></div>
                      </div>
                    ) : qrCode ? (
                      <img
                        src={qrCode}
                        alt="QR Code with Username"
                        className="w-80 h-auto"
                      />
                    ) : (
                      <div className="w-80 h-96 flex items-center justify-center text-gray-400">
                        Unable to generate QR code
                      </div>
                    )}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex-1 space-y-4">
                  <div className="bg-gradient-to-r from-orange-50 to-green-50 rounded-xl p-4 border border-orange-200">
                    <h4 className="font-semibold text-gray-900 mb-2">How to use:</h4>
                    <ul className="space-y-2 text-sm text-gray-700">
                      <li className="flex items-start gap-2">
                        <span className="text-orange-600 font-bold">1.</span>
                        <span>Download the QR code image (includes your name)</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-orange-600 font-bold">2.</span>
                        <span>Share it on social media, business cards, or presentations</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-green-600 font-bold">3.</span>
                        <span>Others can scan it to instantly view and save your contact</span>
                      </li>
                    </ul>
                  </div>

                  <button
                    onClick={handleDownloadQR}
                    disabled={!qrCode}
                    className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-orange-500 to-orange-600 text-white py-3 rounded-xl font-semibold hover:from-orange-600 hover:to-orange-700 transition shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Download className="w-5 h-5" />
                    Download QR Code
                  </button>

                  <Link
                    href={`/${user.uid}`}
                    target="_blank"
                    className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-green-600 to-green-700 text-white py-3 rounded-xl font-semibold hover:from-green-700 hover:to-green-800 transition shadow-lg"
                  >
                    <ExternalLink className="w-5 h-5" />
                    View Public Profile
                  </Link>
                </div>
              </div>

              {/* Hidden canvases for QR generation */}
              <canvas ref={qrCanvasRef} className="hidden" />
              <canvas ref={finalCanvasRef} className="hidden" />
            </div>

            {/* Quick Actions Card */}
            <div className="lg:col-span-3 bg-white rounded-2xl shadow-lg p-6 border-2 border-orange-100">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
              <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-3">
                <Link
                  href={`/${user.uid}`}
                  target="_blank"
                  className="flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-orange-50 to-orange-100 text-orange-700 rounded-lg hover:from-orange-100 hover:to-orange-200 transition text-center font-medium border-2 border-orange-200"
                >
                  <ExternalLink className="w-4 h-4" />
                  View Public Profile
                </Link>
                <Link
                  href="/edit-profile"
                  className="flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-green-50 to-green-100 text-green-700 rounded-lg hover:from-green-100 hover:to-green-200 transition text-center font-medium border-2 border-green-200"
                >
                  <Edit className="w-4 h-4" />
                  Edit Profile
                </Link>
                <button
                  onClick={handleDownloadQR}
                  disabled={!qrCode}
                  className="flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-indigo-50 to-indigo-100 text-indigo-700 rounded-lg hover:from-indigo-100 hover:to-indigo-200 transition text-center font-medium border-2 border-indigo-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Download className="w-4 h-4" />
                  Download QR Code
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-2xl shadow-lg p-8 text-center border-2 border-orange-100">
            <div className="mb-4 inline-flex items-center justify-center w-16 h-16 bg-orange-100 rounded-full">
              <QrCodeIcon className="w-8 h-8 text-orange-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              No Profile Yet
            </h3>
            <p className="text-gray-600 mb-6">
              Create your digital visiting card to get started
            </p>
            <Link
              href="/edit-profile"
              className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-xl hover:from-orange-600 hover:to-orange-700 transition font-semibold shadow-lg"
            >
              <Edit className="w-5 h-5" />
              Create Profile
            </Link>
          </div>
        )}
      </main>
    </div>
  );
}