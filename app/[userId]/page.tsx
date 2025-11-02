/* eslint-disable @typescript-eslint/no-explicit-any */
// app/[userId]/page.tsx
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { notFound } from 'next/navigation';
import ProfileView from '@/components/ProfileView';

interface ProfileData {
  fullName: string;
  designation?: string;
  company?: string;
  bio: string;
  profileImage?: string;
  phone?: string;
  email?: string;
  website?: string;
  linkedin?: string;
  twitter?: string;
  instagram?: string;
  facebook?: string;
}

// Serialize function to convert Firestore data to plain objects
function serializeProfile(data: any): ProfileData {
  return {
    fullName: data.fullName || '',
    designation: data.designation || undefined,
    company: data.company || undefined,
    bio: (data.bio || '') as string,
    profileImage: data.profileImage || undefined,
    phone: data.phone || undefined,
    email: data.email || undefined,
    website: data.website || undefined,
    linkedin: data.linkedin || undefined,
    twitter: data.twitter || undefined,
    instagram: data.instagram || undefined,
    facebook: data.facebook || undefined,
  };
}

async function getProfileByUserId(userId: string): Promise<ProfileData | null> {
  try {
    const profileDoc = await getDoc(doc(db, 'profiles', userId));
    
    if (!profileDoc.exists()) {
      return null;
    }

    const rawData = profileDoc.data();
    return serializeProfile(rawData);
  } catch (error) {
    console.error('Error fetching profile:', error);
    return null;
  }
}

// Force dynamic rendering - no caching
export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function ProfilePage({ params }: { params: Promise<{ userId: string }> }) {
  const { userId } = await params;
  const profile = await getProfileByUserId(userId);

  if (!profile) {
    notFound();
  }

  return <ProfileView profile={profile} userId={userId} />;
}

export async function generateMetadata({ params }: { params: Promise<{ userId: string }> }) {
  const { userId } = await params;
  const profile = await getProfileByUserId(userId);

  if (!profile) {
    return {
      title: 'Profile Not Found',
    };
  }

  return {
    title: `${profile.fullName} - Digital Visiting Card`,
    description: profile.bio || `View ${profile.fullName}'s digital visiting card`,
  };
}